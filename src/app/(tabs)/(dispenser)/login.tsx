import { localInstance } from '@/api/axios'
import HiddenRFIDInput from '@/app/components/HiddenRFIDInput'
import {
	closeSerialPort,
	openSerialPort,
	readMultipleRegisters,
	writeMultipleRegisters,
	writeSingleRegister,
} from '@/command/controlDispenser'
import { colors, storeToken } from '@/constants/tokens'
import { Token } from '@/store/library'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, usePathname } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
	Image,
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

const LoginComponent = () => {
	const { setToken } = Token()
	const [serialPort, setSerialPort] = useState(null)
	const test = usePathname()

	// openSerialPort()

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

	const setupSerial = async () => {
		try {
			const isOpen = await openSerialPort()
			if (isOpen) {
				console.log('✅ Writing single register...')
				await writeSingleRegister(734, 0)

				await delay(100) // Add a delay of 100ms

				console.log('✅ Writing multiple registers...')
				await writeMultipleRegisters(724, 11.11)

				await closeSerialPort()
			}
		} catch (error) {
			console.error('Error setting up serial port:', error)
		}
	}

	const handleRFIDScan = (data) => {
		console.log('Scanned RFID:', data)
		if (data) {
			const body = { cardId: data.trim() }

			localInstance
				.post('/user/cardAuth', body, {
					headers: { 'Content-Type': 'multipart/form-data' },
				})
				.then((res) => {
					const token = res?.data?.result?.token
					storeToken(token)
					setToken(token)
					if (res?.data?.con) {
						router.push('/(tabs)/(dispenser)')
					}
				})
				.catch((e) => {
					console.error('Login failed:', e?.response)
					router.push('/(tabs)/(dispenser)/fail')
				})
		}
	}

	const sendSerialData = async () => {
		if (!serialPort) {
			console.warn('Serial port is not open')
			return
		}
		try {
			await serialPort.send('010302BC00288588')
			console.log('Data sent via serial port')
		} catch (error) {
			console.error('Failed to send data:', error)
		}
	}

	const [config, setConfig] = useState()
	useEffect(() => {
		const loadConfig = async () => {
			try {
				const configString = await AsyncStorage.getItem('fuelDispenserConfig')
				console.log(configString, '..')

				// if (!configString) {
				// 	return <Redirect href="/(tabs)/setup" />
				// }

				if (configString) {
					setConfig(configString)
				}

				return null
			} catch (error) {
				console.error('Error loading config:', error)
				throw error
			}
		}
		loadConfig()

		// clearConfig()
	}, [])
	console.log(config, 'this is config')
	let isListening = false
	const read = async () => {
		isListening = true
		try {
			// const data = await serialPort.read()

      //for integer(32bit)
			// const data = await readMultipleRegisters(704, 2)
			// console.log('Data read from serial port:', data)
			// const floatValue = convertFloat(data[0], data[1])
			// console.log('Converted Float:', floatValue?.toFixed(2))

			while (isListening) {
				try {
					const data = await readMultipleRegisters(708, 1)
					console.log('Data read from serial port:', data)
				} catch (error) {
					console.error('❌ Error reading data:', error)
					// stopListening() // Stop on error
					break
				}
        // setTimeout(() => {
        //   isListening = false
        // }
        // , 3000)
			}
		} catch (error) {
			console.error('Failed to read data:', error)
		}
	}

	// while (isListening) {
	// 	try {
	// 		const data = await readSerialData() // Read data from serial port

	// 		if (data) {
	// 			console.log('🔹 Received Data:', data)

	// 			// Example: Process received data
	// 			if (data.includes('COMPLETE')) {
	// 				console.log('✅ Dispensing complete. Navigating...')
	// 				await closeSerialPort()
	// 				router.push('/(tabs)/(dispenser)')
	// 				stopListening() // Stop listening after navigation
	// 				break // Exit loop
	// 			}

	// 			// Add more conditions if needed
	// 		}
	// 	} catch (error) {
	// 		console.error('❌ Error reading data:', error)
	// 		stopListening() // Stop on error
	// 		break
	// 	}
	// }

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<View style={styles.card}>
					<View style={styles.contentContainer}>
						<Image source={require('../../../../assets/rfid.png')} style={styles.image1} />
						<View style={styles.textContainer}>
							<View style={tw`mt-3`}>
								<Text style={tw`text-[36px] font-semibold text-[${colors.primary}]`}>
									Tap Cashier Card On Card Reader To Unlock The Dispenser
								</Text>
								<HiddenRFIDInput onRFIDScan={handleRFIDScan} />
							</View>
							{/* <TouchableOpacity onPress={sendSerialData} style={styles.button}>
                <Text style={styles.buttonText}>Send Serial Command</Text>
              </TouchableOpacity> */}
							<TouchableOpacity onPress={() => read()} style={styles.button}>
								<Text style={styles.buttonText}>Read Serial Data</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ImageBackground>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f5f5f5' },
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		marginTop: -30,
		marginHorizontal: 'auto',
		width: 800,
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	image: { flex: 1, justifyContent: 'center' },
	contentContainer: { flexDirection: 'row', gap: 16 },
	image1: { width: 280, height: 280, borderRadius: 8 },
	textContainer: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 10 },
	button: {
		backgroundColor: '#007AFF',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 16,
	},
	buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})

export default LoginComponent
