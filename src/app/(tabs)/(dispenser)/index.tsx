import Dispenser from '@/app/components/Dispenser'
import Header from '@/app/components/Header'
import SetupWizard from '@/app/components/Setup'
import { useGlobalState } from '@/store/globalState'
import { DevControl, nozConfig, Token } from '@/store/library'
import { Buffer } from 'buffer'
import { Redirect, usePathname } from 'expo-router'
import Paho from 'paho-mqtt'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import SerialPortAPI, { SerialPort } from 'react-native-serial-port-api'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

interface Nozzle {
	_id: string
	nozzle_no: string
	dep_no: string
	fuel_type: string
	description: string
	daily_price: number
}

interface MQTTMessage {
	destinationName: string
	payloadString: string
}

interface SerialPortConfig {
	portName?: string
	baudRate?: number
}

const MQTT_CONFIG = {
	host: '192.168.1.124',
	port: 9001,
	username: 'detpos',
	password: 'asdffdsa',
	useSSL: false,
}

const SERIAL_PORT_CONFIG: SerialPortConfig = {
	portName: '/dev/ttyS8',
	baudRate: 9600,
}

export default function DispenserScreen() {
	const { setToken, items: token } = Token() as { setToken: (value: string) => void; items: string }
	const { items: configNoz, getConfig } = nozConfig() as { items: string; getConfig: () => void }
	const { getDev, dev, alert } = DevControl() as {
		getDev: (token: string) => void
		dev: { result: Nozzle[] }
		alert: boolean
	}
	const { state } = useGlobalState()
	const mqttClientRef = useRef<Paho.Client | null>(null)
	const serialPortRef = useRef<SerialPort | null>(null)

	const [visible, setVisible] = useState(false)
	const [dispensers, setDispensers] = useState<Nozzle[]>([])
	const [firstNoz, setFirstNoz] = useState(0)
	const [secNoz, setSecNoz] = useState(0)
	const [firstNozPrice, setFirstNozPrice] = useState(0)
	const [secNozPrice, setSecNozPrice] = useState(0)
	const isListeningRef = useRef(false)

	const openSerialPort = useCallback(
		async (
			portName = SERIAL_PORT_CONFIG.portName || '/dev/ttyS8',
			baudRate = SERIAL_PORT_CONFIG.baudRate || 9600,
		) => {
			try {
				serialPortRef.current = await SerialPortAPI.open(portName, { baudRate })
				return true
			} catch (error) {
				console.error('Serial Port Error:', error)
				return false
			}
		},
		[],
	)

	const calculateCRC = useCallback((bytes: Buffer) => {
		let crc = 0xffff
		for (let byte of bytes) crc = crc16Update(crc, byte)
		return Buffer.from([crc & 0xff, (crc >> 8) & 0xff])
	}, [])

	const crc16Update = useCallback((crc: number, a: number) => {
		crc ^= a
		for (let i = 0; i < 8; ++i) crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1
		return crc & 0xffff
	}, [])

	const readMultipleRegisters = useCallback(
		async (startRegister: number, numRegisters: number, sId = 1) => {
			if (!serialPortRef.current && !(await openSerialPort())) return null

			const packet = Buffer.from([
				sId,
				0x03,
				(startRegister >> 8) & 0xff,
				startRegister & 0xff,
				(numRegisters >> 8) & 0xff,
				numRegisters & 0xff,
			])
			const crc = calculateCRC(packet)
			const fullPacket = Buffer.concat([packet, crc])

			await serialPortRef.current?.send(fullPacket.toString('hex'))

			return new Promise((resolve) => {
				let response = Buffer.alloc(0)
				serialPortRef.current?.onReceived((data: Uint8Array) => {
					response = Buffer.concat([response, data])
					if (response.length >= 3 + numRegisters * 2 + 2) {
						resolve(parseResponse(response, sId, 0x03, numRegisters, startRegister))
					}
				})
			})
		},
		[calculateCRC, openSerialPort],
	)

	const parseResponse = useCallback(
		(
			response: Buffer,
			slaveId: number,
			functionCode: number,
			numRegisters: number,
			startRegister: number,
		) => {
			if (response[0] !== slaveId || response[1] !== functionCode) return
			const byteCount = response[2]
			if (byteCount !== numRegisters * 2) return

			const data = response.slice(3, 3 + byteCount)
			const registers = []
			for (let i = 0; i < byteCount; i += 2) {
				registers.push((data[i] << 8) | data[i + 1])
			}
			return registers
		},
		[],
	)

	const delay = useCallback((ms: number) => new Promise((res) => setTimeout(res, ms)), [])

	const read = useCallback(async () => {
		if (isListeningRef.current) {
			console.warn('Read operation already in progress. Skipping...')
			return
		}
		isListeningRef.current = true

		try {
			let toggle = true
			const timeout = setTimeout(() => {
				isListeningRef.current = false
				console.log('Read operation timed out.')
			}, 10000)

			while (isListeningRef.current) {
				const address = toggle ? 700 : 800
				const data = (await readMultipleRegisters(address + 8, 1)) as number[] | null
				if (!data) break

				const liter = data ? data[0] : 0
				const price = liter * 10
				const payload = `${address}L${liter}P${price}`

				if (mqttClientRef.current?.isConnected()) {
					const topic = 'detpos/device/livedata/1'
					mqttClientRef.current.send(topic, payload, 0, false)
					address === 700
						? (setFirstNoz(liter), setFirstNozPrice(price))
						: (setSecNoz(liter), setSecNozPrice(price))
				}

				toggle = !toggle
				await delay(1000)
			}

			clearTimeout(timeout)
		} catch (error) {
			console.error('Read operation error:', error)
		} finally {
			isListeningRef.current = false
		}
	}, [delay, readMultipleRegisters])

	const stopListening = useCallback(() => {
		isListeningRef.current = false
	}, [])

	const handleMQTTMessage = useCallback(
		(message: MQTTMessage) => {
			const topic = message.destinationName
			console.log(topic, 'this is topic')

			switch (topic) {
				case 'detpos/local_server/1':
					console.log('Triggering read operation...')
					read()
					break
				case 'detpos/device/livedata/1':
					const data = message.payloadString.split('L')
					const liter = parseInt(data[1].split('P')[0], 10)
					const price = parseInt(data[1].split('P')[1], 10)
					break
				case 'detpos/local_server/dispensers':
					const payload = JSON.parse(message.payloadString)
					if (payload?.status === 'success') {
						setDispensers(payload?.data)
					}
					break
				default:
					console.log('Unknown topic:', topic)
			}
		},
		[read],
	)

	useEffect(() => {
		const client = new Paho.Client(
			MQTT_CONFIG.host,
			MQTT_CONFIG.port,
			`android-${Math.floor(Math.random() * 100)}`,
		)

		const connect = async () => {
			if (mqttClientRef.current) {
				mqttClientRef.current.disconnect()
				console.log('MQTT Disconnected')
			}

			try {
				await client.connect({
					onSuccess: () => {
						client.subscribe('detpos/device/#')
						client.subscribe('detpos/local_server/#')
						console.log('MQTT Connected')
					},
					onFailure: (err: any) => console.log('MQTT Error:', err),
					userName: MQTT_CONFIG.username,
					password: MQTT_CONFIG.password,
					useSSL: MQTT_CONFIG.useSSL,
				})
			} catch (error) {
				console.error('MQTT Connection Error:', error)
			}

			mqttClientRef.current = client
			client.onMessageArrived = handleMQTTMessage
		}

		connect()
		return () => {
			if (mqttClientRef.current) {
				mqttClientRef.current.disconnect()
				console.log('MQTT Disconnected')
			}
		}
	}, [handleMQTTMessage])

	useEffect(() => {
		getConfig()
		return () => {
			stopListening()
		}
	}, [getConfig, stopListening])

	useEffect(() => {
		if (token) getDev(token)
	}, [token, getDev])

	useEffect(() => {
		if (dev?.result) setDispensers(dev.result)
	}, [dev])

	useEffect(() => {
		setVisible(!!alert)
	}, [alert])

	const filData =
		configNoz &&
		JSON.parse(configNoz)?.nozzleConfigs?.map((n: { number: string }) => n.number.padStart(2, '0'))

	const nozData = useMemo(
		() => dispensers.filter((d: Nozzle) => filData?.includes(d?.nozzle_no)) as Nozzle[],
		[dispensers],
	)

	console.log(nozData, 'this is nozData')

	if (!token) return <Redirect href="/login" />

	const location = usePathname()

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<Header />
				{configNoz ? (
					<ScrollView contentContainerStyle={styles.scrollContent}>
						<View style={styles.grid}>
							{nozData.slice(0, 2).map((noz, idx) => (
								<Dispenser
									key={noz?._id}
									click={read}
									noz={parseInt(noz?.nozzle_no || '0', 10)}
									dis={noz?.dep_no}
									title={noz?.fuel_type}
									description={noz?.description}
									price={noz?.daily_price}
									saleLiter={idx === 0 ? firstNoz : secNoz}
									totalPrice={idx === 0 ? firstNozPrice : secNozPrice}
									addr={JSON.parse(configNoz)?.nozzleConfigs}
								/>
							))}
						</View>
					</ScrollView>
				) : (
					<SetupWizard />
				)}

				<Snackbar
					visible={visible}
					onDismiss={() => setVisible(false)}
					style={tw`ml-auto mb-10 mr-14 w-[320px] bg-green-300`}
				>
					<Text style={tw`text-2xl text-gray-800`}>Process Success!</Text>
				</Snackbar>
			</ImageBackground>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f5f5f5' },
	image: { flex: 1, padding: 0, justifyContent: 'center' },
	scrollContent: { padding: 16 },
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
})
