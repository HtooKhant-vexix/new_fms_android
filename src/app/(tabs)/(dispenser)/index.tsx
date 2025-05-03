import Dispenser from '@/app/components/Dispenser'
import Header from '@/app/components/Header'
import SetupWizard from '@/app/components/Setup'
import { useGlobalState } from '@/store/globalState'
import { DevControl, nozConfig, Token } from '@/store/library'
import { Buffer } from 'buffer'
import { Redirect, usePathname } from 'expo-router'
import Paho from 'paho-mqtt'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import SerialPortAPI, { SerialPort } from 'react-native-serial-port-api'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

export default function DispenserScreen() {
	const { setToken, items: token } = Token() as { setToken: (value: string) => void; items: string }
	const { items: configNoz, getConfig } = nozConfig() as { items: string; getConfig: () => void }
	const { getDev, dev, alert } = DevControl() as {
		getDev: (token: string) => void
		dev: any
		alert: boolean
	}
	const { state } = useGlobalState()
	const mqttClientRef = useRef<Paho.Client | null>(null)

	const [visible, setVisible] = useState(false)
	const [dispensers, setDispensers] = useState([])
	const [firstNoz, setFirstNoz] = useState(0)
	const [secNoz, setSecNoz] = useState(0)
	const [firstNozPrice, setFirstNozPrice] = useState(0)
	const [secNozPrice, setSecNozPrice] = useState(0)
	const isListeningRef = useRef(false)
	let serialPort: SerialPort

	useEffect(() => {
		const client = new Paho.Client(
			'192.168.1.146',
			9001,
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
					userName: 'detpos',
					password: 'asdffdsa',
					useSSL: false,
				})
			} catch (error) {
				console.error('MQTT Connection Error:', error)
			}

			mqttClientRef.current = client
			let lastMessageTimestamp = 0

			client.onMessageArrived = (message: any) => {
				const now = Date.now()

				// Debounce: Ignore messages received within 500ms of the last one
				if (now - lastMessageTimestamp < 500) {
					return
				}
				lastMessageTimestamp = now
				const topic = message.destinationName
				console.log(topic, 'this is topic')

				switch (topic) {
					case 'detpos/device/1':
						console.log('Triggering read operation...')
						read()
						break
					case 'detpos/device/livedata/1':
						const data = message.payloadString.split('L')
						const liter = parseInt(data[1].split('P')[0], 10)
						const price = parseInt(data[1].split('P')[1], 10)
						// if (data[0] === '700') {
						// 	setFirstNoz(liter)
						// 	setFirstNozPrice(price)
						// } else if (data[0] === '800') {
						// 	setSecNoz(liter)
						// 	setSecNozPrice(price)
						// }
						break
					case 'detpos/local_server/dispensers':
					case 'detpos/local_server/alert':
						const payload = JSON.parse(message.payloadString)
						if (payload?.status === 'success') {
							if (topic === 'detpos/local_server/dispensers') {
								setDispensers(payload?.data)
							} else {
								setVisible(true)
								getConfig()
							}
						}
						break
					default:
						console.log('Unknown topic:', topic)
				}
			}
		}

		connect()
	}, [])

	useEffect(() => {
		getConfig()
		return () => {
			stopListening()
		}
	}, [])

	useEffect(() => {
		if (state?.nozzleActive) read()
	}, [state?.nozzleActive])

	useEffect(() => {
		if (token) getDev(token)
	}, [token])

	useEffect(() => {
		if (dev?.result) setDispensers(dev.result)
	}, [dev])

	useEffect(() => {
		setVisible(!!alert)
	}, [alert])

	const openSerialPort = async (portName = '/dev/ttyS8', baudRate = 9600) => {
		try {
			serialPort = await SerialPortAPI.open(portName, { baudRate })
			return true
		} catch (error) {
			console.error('Serial Port Error:', error)
			return false
		}
	}

	const calculateCRC = (bytes: Buffer<ArrayBuffer>) => {
		let crc = 0xffff
		for (let byte of bytes) crc = crc16Update(crc, byte)
		return Buffer.from([crc & 0xff, (crc >> 8) & 0xff])
	}

	const crc16Update = (crc: number, a: number) => {
		crc ^= a
		for (let i = 0; i < 8; ++i) crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1
		return crc & 0xffff
	}

	const readMultipleRegisters = async (startRegister: number, numRegisters: number, sId = 1) => {
		if (!(await openSerialPort())) return null
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

		await serialPort.send(fullPacket.toString('hex'))

		return new Promise((resolve) => {
			let response = Buffer.alloc(0)
			serialPort.onReceived((data: Uint8Array<ArrayBufferLike>) => {
				response = Buffer.concat([response, data])
				if (response.length >= 3 + numRegisters * 2 + 2) {
					resolve(parseResponse(response, sId, 0x03, numRegisters, startRegister))
				}
			})
		})
	}

	const parseResponse = (
		response: string | any[] | Buffer<ArrayBuffer>,
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
	}

	const delay = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms))

	const read = async () => {
		if (isListeningRef.current) {
			console.warn('Read operation already in progress. Skipping...')
			return // Prevent overlapping calls
		}
		isListeningRef.current = true
		try {
			let toggle = true
			const timeout = setTimeout(() => {
				isListeningRef.current = false // Stop listening after 10 seconds
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
				} else {
					console.warn('MQTT not connected')
				}

				toggle = !toggle
				await delay(5)
			}
			clearTimeout(timeout)
		} catch {
			console.error('Error during read operation:', error)
		} finally {
			isListeningRef.current = false // Reset the flag
			console.log('Read operation completed.')
		}
	}

	const stopListening = () => (isListeningRef.current = false)

	const filData =
		configNoz &&
		JSON.parse(configNoz)?.nozzleConfigs?.map((n: { number: string }) => n.number.padStart(2, '0'))
	interface Nozzle {
		_id: string
		nozzle_no: string
		dep_no: string
		fuel_type: string
		description: string
		daily_price: number
	}

	const nozData = useMemo(
		() => dispensers.filter((d: Nozzle) => filData?.includes(d?.nozzle_no)) as Nozzle[],
		[dispensers],
	)

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
