import Dispenser from '@/app/components/Dispenser'
import Header from '@/app/components/Header'
import SetupWizard from '@/app/components/Setup'
import { DevControl, nozConfig, Token } from '@/store/library'
import { Buffer } from 'buffer'
import { Redirect, usePathname } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import SerialPortAPI from 'react-native-serial-port-api'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

export default function DispenserScreen() {
	const { setToken, items: token } = Token() as { setToken: (value: string) => void; items: string }
	const { items: configNoz } = nozConfig()
	const { getDev, dev, alert } = DevControl()

	const [visible, setVisible] = useState(false)
	interface DispenserType {
		_id: string
		nozzle_no: string
		dep_no: string
		fuel_type: string
		description: string
		iconSource: string
		daily_price: number
		status: string
	}

	let isListening
	// const nozAddr = addr.find((e) => e.number === noz).address
	const nozAddr = 700
	let serialPort = null

	const [liveData, setLiveData] = useState(0.0)
	const [tPrice, setTPrice] = useState(0)
	const isListeningRef = useRef(false) // Use `useRef` instead of `useState`

	const calculateCRC = (bytes) => {
		let crc = 0xffff
		for (let byte of bytes) {
			crc = crc16Update(crc, byte)
		}
		return Buffer.from([crc & 0xff, (crc >> 8) & 0xff])
	}

	const crc16Update = (crc, a) => {
		crc ^= a
		for (let i = 0; i < 8; ++i) {
			crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1
		}
		return crc & 0xffff
	}

	// ✅ Open Serial Port
	const openSerialPort = async (portName = '/dev/ttyS8', baudRate = 9600) => {
		try {
			serialPort = await SerialPortAPI.open(portName, { baudRate })
			// console.log('✅ Serial port opened successfully', serialPort)

			serialPort.onReceived((buff) => {
				// console.log('📩 Received data:', buff.toString('hex'))
			})

			return true
		} catch (error) {
			console.error('❌ Error opening serial port:', error)
			return false
		}
	}

	const readMultipleRegisters = async (startRegister, numRegisters, sId = 1) => {
		const isOpen = await openSerialPort()
		// console.log('isOpen', serialPort)
		// console.log('✅ Reading multiple registers...')
		try {
			if (!isOpen) {
				console.warn('⚠️ Serial port is not open')
				return null
			}
			// Build request packet
			const slaveId = sId
			const functionCode = 0x03
			const packet = Buffer.from([
				slaveId,
				functionCode,
				(startRegister >> 8) & 0xff,
				startRegister & 0xff,
				(numRegisters >> 8) & 0xff,
				numRegisters & 0xff,
			])

			const crc = calculateCRC(packet)
			const fullPacket = Buffer.concat([packet, crc])

			// Send request
			await serialPort.send(fullPacket.toString('hex'))

			// Read response
			return new Promise((resolve) => {
				let response = Buffer.alloc(0)
				serialPort.onReceived((data) => {
					console.log('📩 Received data:', data)
					response = Buffer.concat([response, data])
					// Check if we have enough bytes for the expected response
					if (response.length >= 3 + numRegisters * 2 + 2) {
						resolve(parseResponse(response, slaveId, functionCode, numRegisters, startRegister))
					}
				})
			})
		} catch (error) {
			console.error('❌ Error with SerialPort:', error)
			return null
		}
	}

	// ✅ Parse Response
	const parseResponse = (response, slaveId, functionCode, numRegisters, startRegister) => {
		if (response[0] !== slaveId || response[1] !== functionCode) {
			console.error('Invalid response:', response.toString('hex'))
			return
		}

		const byteCount = response[2]
		if (byteCount !== numRegisters * 2) {
			console.error(`Expected ${numRegisters * 2} bytes, got ${byteCount}`)
			return
		}

		const data = response.slice(3, 3 + byteCount)
		const registers = []
		for (let i = 0; i < byteCount; i += 2) {
			registers.push((data[i] << 8) | data[i + 1])
		}

		// console.log(`✅ Read ${registers.length} registers from ${startRegister}:`, registers)

		const receivedCRC = (response[response.length - 1] << 8) | response[response.length - 2]
		const calculatedCRC = calculateCRC(response.slice(0, -2))
		// console.log('CRC Valid:', receivedCRC === calculatedCRC)

		return registers
	}

	useEffect(() => {
		return () => stopListening()
	}, [])

	const read = async () => {
		isListeningRef.current = true // Update ref, not state

		try {
			while (isListeningRef.current) {
				// Check ref, not state
				try {
					// console.log(nozAddr)
					const data = await readMultipleRegisters(Number(nozAddr) + 8, 1)
					setLiveData(data[0])
					setTPrice(data[0] * 100)
					if (true) {
						// console.log('Data:', data)

						const data = await readMultipleRegisters(Number(nozAddr) + 8, 1)
						// setLiveData(data[0])
						// setTPrice(data[0] * 100)
					}
					// setTPrice(data[0] * price)
				} catch (error) {
					console.error('Error reading data:', error)
					stopListening()
					break
				}
			}
		} catch (error) {
			console.error('Failed to read data:', error)
		}
	}

	const stopListening = () => {
		isListeningRef.current = false // Update ref to stop loop
	}

	const [dispensers, setDispensers] = useState<DispenserType[]>([])
	const [config, setConfig] = useState(null)
	const [loadingConfig, setLoadingConfig] = useState(true)

	const filData =
		configNoz &&
		JSON.parse(configNoz)?.nozzleConfigs?.map((nozzle) => nozzle?.number.padStart(2, '0'))
	// console.log(dispensers.filter((dispenser) => filData?.includes(dispenser?.nozzle_no)))
	// console.log(filData)
	const nozData = dispensers.filter((dispenser) => filData?.includes(dispenser?.nozzle_no))
	// console.log(configNoz && JSON.parse(configNoz)?.nozzleConfigs, 'hhhh')

	// Show Snackbar if alert is triggered
	useEffect(() => {
		setVisible(!!alert)
	}, [alert])

	// Fetch dispensers if token is available
	useEffect(() => {
		if (token) {
			getDev(token)
		}
	}, [token])

	// Update dispensers when dev data is received
	useEffect(() => {
		if (dev?.result) {
			setDispensers(dev.result)
		}
	}, [dev])

	// Load configuration from AsyncStorage
	// useEffect(() => {
	// 	const loadConfig = async () => {
	// 		try {
	// 			const configString = await AsyncStorage.getItem('fuelDispenserConfig')
	// 			setConfig(configString ? configString : null)
	// 		} catch (error) {
	// 			console.error('Error loading config:', error)
	// 		} finally {
	// 			setLoadingConfig(false)
	// 		}
	// 	}
	// 	loadConfig()
	// 	// clearConfig()
	// }, [])
	// clearConfig()

	// Redirect to login if token is missing
	if (!token) {
		return <Redirect href="/login" />
	}

	// Redirect to setup if config is missing
	// if (!loadingConfig && !config) {
	// 	return <Redirect href="/(tabs)/setup" />
	// }
	const location = usePathname()

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<Header />
				{configNoz ? (
					<ScrollView contentContainerStyle={styles.scrollContent}>
						{/* Grid for dispensers */}
						{/* <TouchableOpacity
							onPress={() => {
								console.log('hello'), read()
							}}
						>
							<Text style={tw`p-10 bg-white`}>Hello</Text>
						</TouchableOpacity> */}
						<View style={styles.grid}>
							{nozData.map((dispenser) => (
								<Dispenser
									key={dispenser?._id}
									noz={dispenser?.nozzle_no}
									dis={dispenser?.dep_no}
									title={dispenser?.fuel_type}
									description={dispenser?.description}
									iconSource={dispenser?.iconSource}
									price={dispenser?.daily_price}
									status={dispenser?.status}
									addr={configNoz && JSON.parse(configNoz)?.nozzleConfigs}
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
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	image: {
		flex: 1,
		padding: 0,
		justifyContent: 'center',
	},
	scrollContent: {
		padding: 16,
	},
	grid: {
		flexDirection: 'row',
		// paddingStart: 16,
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
})
