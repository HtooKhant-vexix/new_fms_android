import Dispenser from '@/app/components/Dispenser'
import Header from '@/app/components/Header'
import SetupWizard from '@/app/components/Setup'
import { DevControl, nozConfig, Token } from '@/store/library'
import { Buffer } from 'buffer'
import { Redirect, usePathname } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import SerialPortAPI, { SerialPort } from 'react-native-serial-port-api'
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
	let serialPort: SerialPort

	const [liveData, setLiveData] = useState(0.0)
	const [tPrice, setTPrice] = useState(0)
	const isListeningRef = useRef(false) // Use `useRef` instead of `useState`

	const calculateCRC = (bytes: Buffer<ArrayBuffer>) => {
		let crc = 0xffff
		for (let byte of bytes) {
			crc = crc16Update(crc, byte)
		}
		return Buffer.from([crc & 0xff, (crc >> 8) & 0xff])
	}

	const crc16Update = (crc: number, a: number) => {
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

	const readMultipleRegisters = async (startRegister: number, numRegisters: number, sId = 1) => {
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
				serialPort.onReceived((data: Uint8Array<ArrayBufferLike>) => {
					// console.log('📩 Received data:', data)
					response = Buffer.concat([response, data])
					// const address = toggle ? 700 : 800
					// if (address === 700) {
					// 	setFirstNoz(data)
					// } else {
					// 	setSecNoz(data)
					// }
					// setToggle(!toggle)
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
	const parseResponse = (
		response: string | any[] | Buffer<ArrayBuffer>,
		slaveId: number,
		functionCode: number,
		numRegisters: number,
		startRegister: any,
	) => {
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
		const calculatedCRC = calculateCRC(response?.slice(0, -2))
		// console.log('CRC Valid:', receivedCRC === calculatedCRC)

		return registers
	}

	useEffect(() => {
		return () => stopListening()
	}, [])

	// const [toggle, setToggle] = React.useState(true)
	const [firstNoz, setFirstNoz] = React.useState(0)
	const [secNoz, setSecNoz] = React.useState(0)
	const [firstNozPrice, setFirstNozPrice] = React.useState(0)
	const [secNozPrice, setSecNozPrice] = React.useState(0)

	const read = async () => {
		isListeningRef.current = true // Update ref, not state
		setTimeout(() => {
			isListeningRef.current = false
			console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', isListeningRef.current)
		}, 3000)
		let toggle = true
		try {
			while (isListeningRef.current) {
				const address = toggle ? 700 : 800
				// Check ref, not state
				try {
					// console.log(nozAddr)
					if (address === 700) {
						const data: any = await readMultipleRegisters(700 + 8, 1)
						// setLiveData(data[0])
						// setTPrice(data[0] * 100)
						console.log('Data:...................................', toggle)
						setFirstNozPrice(data[0] * 10)
						setFirstNoz(data[0])
					} else {
						const data: any = await readMultipleRegisters(800 + 8, 1)
						// const data = await readMultipleRegisters(Number(nozAddr) + 8, 1)
						// setLiveData(data[0])
						// setTPrice(data[0] * 100)
						setSecNozPrice(data[0] * 10)
						setSecNoz(data[0])
						console.log('Data:...................................', toggle)
					}
					toggle = !toggle
					// if (true) {
					// 	// console.log('Data:', data)

					// 	const data = await readMultipleRegisters(Number(nozAddr) + 8, 1)
					// 	// setLiveData(data[0])
					// 	// setTPrice(data[0] * 100)
					// }
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
		JSON.parse(configNoz)?.nozzleConfigs?.map((nozzle: { number: string }) =>
			nozzle?.number.padStart(2, '0'),
		)

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

	console.log(firstNoz, 'firstNoz')
	console.log(secNoz, 'secNoz')
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

	console.log(nozData, 'this is nozzle data')

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
							{/* {nozData.map((dispenser) => ( */}
							<Dispenser
								click={() => {
									read()
									// setTimeout(() => {
									// 	stopListening(),
									// 		console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', isListeningRef.current)
									// }, 3000)
								}}
								key={nozData[0]?._id}
								noz={nozData[0]?.nozzle_no}
								dis={nozData[0]?.dep_no}
								title={nozData[0]?.fuel_type}
								description={nozData[0]?.description}
								// iconSource={nozData[0]?.iconSource}
								price={nozData[0]?.daily_price}
								saleLiter={firstNoz}
								totalPrice={firstNozPrice}
								// status={nozData[0]?.status}
								addr={configNoz && JSON.parse(configNoz)?.nozzleConfigs}
							/>
							<Dispenser
								click={() => {
									read()
									// setTimeout(() => {
									// 	stopListening(),
									// 		console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', isListeningRef.current)
									// }, 3000)
								}}
								key={nozData[1]?._id}
								noz={nozData[1]?.nozzle_no}
								dis={nozData[1]?.dep_no}
								title={nozData[1]?.fuel_type}
								description={nozData[1]?.description}
								// iconSource={nozData[1]?.iconSource}
								price={nozData[1]?.daily_price}
								saleLiter={secNoz}
								totalPrice={secNozPrice}
								// status={nozData[1]?.status}
								addr={configNoz && JSON.parse(configNoz)?.nozzleConfigs}
							/>
							{/* ))} */}
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
