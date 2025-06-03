import Dispenser from '@/app/components/Dispenser'
import Header from '@/app/components/Header'
import SetupWizard from '@/app/components/Setup'
import { useGlobalState } from '@/store/globalState'
import { DevControl, nozConfig, Token } from '@/store/library'
import { Buffer } from 'buffer'
import { Redirect } from 'expo-router'
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
	portName: string
	baudRate: number
}

interface MQTTConfig {
	host: string
	port: number
	username: string
	password: string
	useSSL: boolean
	clientId: string
}

interface DispenserData {
	liter: number
	price: number
	isPolling: boolean
	lastUpdate: number
}

const MQTT_CONFIG: MQTTConfig = {
	host: '192.168.1.124',
	port: 9001,
	username: 'detpos',
	password: 'asdffdsa',
	useSSL: false,
	clientId: `android-${Math.floor(Math.random() * 1000000)}`,
}

const SERIAL_PORT_CONFIG: SerialPortConfig = {
	portName: '/dev/ttyS8',
	baudRate: 9600,
}

const TIMEOUT_DURATION = 10000
const POLLING_INTERVAL = 2000 // 2 seconds polling interval
const NOZZLE_ADDRESSES = {
	NOZZLE_1: 700,
	NOZZLE_2: 800,
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
	const [dispenserData, setDispenserData] = useState<{ [key: number]: DispenserData }>({
		[NOZZLE_ADDRESSES.NOZZLE_1]: { liter: 0, price: 0, isPolling: false, lastUpdate: 0 },
		[NOZZLE_ADDRESSES.NOZZLE_2]: { liter: 0, price: 0, isPolling: false, lastUpdate: 0 },
	})
	const pollingRefs = useRef<{ [key: number]: NodeJS.Timeout | null }>({
		[NOZZLE_ADDRESSES.NOZZLE_1]: null,
		[NOZZLE_ADDRESSES.NOZZLE_2]: null,
	})

	const [mqttConnected, setMqttConnected] = useState(false)
	const mqttReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const openSerialPort = useCallback(async () => {
		try {
			serialPortRef.current = await SerialPortAPI.open(SERIAL_PORT_CONFIG.portName, {
				baudRate: SERIAL_PORT_CONFIG.baudRate,
			})
			return true
		} catch (error) {
			console.error('Serial Port Error:', error)
			return false
		}
	}, [])

	const calculateCRC = useCallback((bytes: Buffer): Buffer => {
		let crc = 0xffff
		for (const byte of bytes) {
			crc = crc16Update(crc, byte)
		}
		return Buffer.from([crc & 0xff, (crc >> 8) & 0xff])
	}, [])

	const crc16Update = useCallback((crc: number, a: number): number => {
		crc ^= a
		for (let i = 0; i < 8; ++i) {
			crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1
		}
		return crc & 0xffff
	}, [])

	const readMultipleRegisters = useCallback(
		async (startRegister: number, numRegisters: number, sId = 1): Promise<number[] | null> => {
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
						const parsed = parseResponse(response, sId, 0x03, numRegisters, startRegister)
						resolve(parsed ?? null)
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
		): number[] | undefined => {
			if (response[0] !== slaveId || response[1] !== functionCode) return
			const byteCount = response[2]
			if (byteCount !== numRegisters * 2) return

			const data = response.slice(3, 3 + byteCount)
			const registers: number[] = []
			for (let i = 0; i < byteCount; i += 2) {
				registers.push((data[i] << 8) | data[i + 1])
			}
			return registers
		},
		[],
	)

	const delay = useCallback((ms: number) => new Promise((res) => setTimeout(res, ms)), [])

	const updateDispenserData = useCallback((address: number, liter: number, price: number) => {
		setDispenserData((prev) => ({
			...prev,
			[address]: {
				...prev[address],
				liter,
				price,
				lastUpdate: Date.now(),
			},
		}))
	}, [])

	const connectMQTT: () => Promise<void> = useCallback(async (): Promise<void> => {
		if (mqttClientRef.current?.isConnected()) {
			console.log('MQTT already connected')
			return
		}

		try {
			if (mqttClientRef.current) {
				mqttClientRef.current.disconnect()
				mqttClientRef.current = null
			}

			const client = new Paho.Client(MQTT_CONFIG.host, MQTT_CONFIG.port, MQTT_CONFIG.clientId)

			client.onConnectionLost = (responseObject: { errorCode: number; errorMessage: string }) => {
				if (responseObject.errorCode !== 0) {
					console.log('MQTT Connection Lost:', responseObject.errorMessage)
					setMqttConnected(false)
					// Attempt to reconnect after 5 seconds
					if (mqttReconnectTimeoutRef.current) {
						clearTimeout(mqttReconnectTimeoutRef.current)
					}
					mqttReconnectTimeoutRef.current = setTimeout(() => {
						void connectMQTT()
					}, 5000)
				}
			}

			client.onMessageArrived = handleMQTTMessage

			await client.connect({
				onSuccess: () => {
					console.log('MQTT Connected')
					setMqttConnected(true)
					client.subscribe('detpos/device/#')
					client.subscribe('detpos/local_server/#')
				},
				onFailure: (err: { errorCode: number; errorMessage: string }) => {
					console.error('MQTT Connection Error:', err)
					setMqttConnected(false)
					// Attempt to reconnect after 5 seconds
					if (mqttReconnectTimeoutRef.current) {
						clearTimeout(mqttReconnectTimeoutRef.current)
					}
					mqttReconnectTimeoutRef.current = setTimeout(() => {
						void connectMQTT()
					}, 5000)
				},
				userName: MQTT_CONFIG.username,
				password: MQTT_CONFIG.password,
				useSSL: MQTT_CONFIG.useSSL,
				keepAliveInterval: 60,
				cleanSession: true,
			})

			mqttClientRef.current = client
		} catch (error) {
			console.error('MQTT Connection Error:', error)
			setMqttConnected(false)
			// Attempt to reconnect after 5 seconds
			if (mqttReconnectTimeoutRef.current) {
				clearTimeout(mqttReconnectTimeoutRef.current)
			}
			mqttReconnectTimeoutRef.current = setTimeout(() => {
				void connectMQTT()
			}, 5000)
		}
	}, [handleMQTTMessage])

	const pollDispenser: (address: number) => Promise<void> = useCallback(
		async (address: number): Promise<void> => {
			try {
				const data = await readMultipleRegisters(address + 8, 1)
				if (!data) {
					console.warn(`No data received for nozzle ${address}`)
					return
				}

				const liter = data[0] || 0
				const price = liter * 10
				const payload = `${address}L${liter}P${price}`

				console.log(`[Nozzle ${address}] Received data:`, { liter, price })

				if (mqttClientRef.current?.isConnected()) {
					const topic = 'detpos/device/livedata/1'
					mqttClientRef.current.send(topic, payload, 0, false)
					updateDispenserData(address, liter, price)
				} else {
					console.warn('MQTT not connected, attempting to reconnect...')
					void connectMQTT()
				}
			} catch (error) {
				console.error(`Error polling nozzle ${address}:`, error)
			}
		},
		[readMultipleRegisters, updateDispenserData, connectMQTT],
	)

	const handleMQTTMessage: (message: MQTTMessage) => void = useCallback(
		(message: MQTTMessage) => {
			const topic = message.destinationName

			switch (topic) {
				case 'detpos/local_server/1':
					void pollDispenser(NOZZLE_ADDRESSES.NOZZLE_1)
					void pollDispenser(NOZZLE_ADDRESSES.NOZZLE_2)
					break
				case 'detpos/device/livedata/1':
					const [address, data] = message.payloadString.split('L')
					const [liter, price] = data.split('P').map(Number)
					updateDispenserData(Number(address), liter, price)
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
		[pollDispenser, updateDispenserData],
	)

	const startPolling = useCallback(
		(address: number) => {
			if (pollingRefs.current[address]) {
				console.log(`Polling already active for nozzle ${address}`)
				return
			}

			console.log(`Starting polling for nozzle ${address}`)
			setDispenserData((prev) => ({
				...prev,
				[address]: { ...prev[address], isPolling: true },
			}))

			// Initial poll
			pollDispenser(address)

			// Set up interval
			pollingRefs.current[address] = setInterval(() => {
				pollDispenser(address)
			}, POLLING_INTERVAL)
		},
		[pollDispenser],
	)

	const stopPolling = useCallback((address: number) => {
		if (pollingRefs.current[address]) {
			console.log(`Stopping polling for nozzle ${address}`)
			clearInterval(pollingRefs.current[address])
			pollingRefs.current[address] = null
			setDispenserData((prev) => ({
				...prev,
				[address]: { ...prev[address], isPolling: false },
			}))
		}
	}, [])

	const togglePolling = useCallback(
		(address: number) => {
			const isCurrentlyPolling = pollingRefs.current[address] !== null
			if (isCurrentlyPolling) {
				stopPolling(address)
			} else {
				startPolling(address)
			}
		},
		[startPolling, stopPolling],
	)

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			Object.keys(pollingRefs.current).forEach((address) => {
				const ref = pollingRefs.current[Number(address)]
				if (ref !== null) {
					clearInterval(ref)
				}
			})
		}
	}, [])

	useEffect(() => {
		getConfig()
		return () => {
			Object.keys(pollingRefs.current).forEach((address) => {
				const ref = pollingRefs.current[Number(address)]
				if (ref !== null) {
					clearInterval(ref)
				}
			})
		}
	}, [getConfig])

	useEffect(() => {
		if (token) getDev(token)
	}, [token, getDev])

	useEffect(() => {
		if (dev?.result) setDispensers(dev.result)
	}, [dev])

	useEffect(() => {
		setVisible(!!alert)
	}, [alert])

	// Initial MQTT connection
	useEffect(() => {
		void connectMQTT()

		return () => {
			if (mqttReconnectTimeoutRef.current) {
				clearTimeout(mqttReconnectTimeoutRef.current)
			}
			if (mqttClientRef.current) {
				mqttClientRef.current.disconnect()
				mqttClientRef.current = null
			}
		}
	}, [connectMQTT])

	const filData = useMemo(
		() =>
			configNoz &&
			JSON.parse(configNoz)?.nozzleConfigs?.map((n: { number: string }) =>
				n.number.padStart(2, '0'),
			),
		[configNoz],
	)

	const nozData = useMemo(
		() => dispensers.filter((d: Nozzle) => filData?.includes(d?.nozzle_no)) as Nozzle[],
		[dispensers, filData],
	)

	if (!token) return <Redirect href="/login" />

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<Header />
				{configNoz ? (
					<ScrollView contentContainerStyle={styles.scrollContent}>
						<View style={styles.grid}>
							{nozData.slice(0, 2).map((noz, idx) => {
								const address = idx === 0 ? NOZZLE_ADDRESSES.NOZZLE_1 : NOZZLE_ADDRESSES.NOZZLE_2
								return (
									<Dispenser
										key={noz?._id}
										click={() => togglePolling(address)}
										noz={parseInt(noz?.nozzle_no || '0', 10)}
										dis={noz?.dep_no}
										title={noz?.fuel_type}
										description={noz?.description}
										price={noz?.daily_price}
										saleLiter={dispenserData[address].liter}
										totalPrice={dispenserData[address].price}
										addr={JSON.parse(configNoz)?.nozzleConfigs}
									/>
								)
							})}
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
