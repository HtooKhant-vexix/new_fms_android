import { localInstance } from '@/api/axios'
import HiddenRFIDInput from '@/app/components/HiddenRFIDInput'
import { colors, storeToken } from '@/constants/tokens'
import { Token } from '@/store/library'
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
import SerialPortAPI from 'react-native-serial-port-api'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

const LoginComponent = () => {
	const { setToken } = Token()
	const [serialPort, setSerialPort] = useState(null)
	const test = usePathname()

	useEffect(() => {
		const setupSerialPort = async () => {
			try {
				const port = await SerialPortAPI.open('/dev/ttyS8', { baudRate: 9600 })
				console.log('Serial port opened successfully')

				const subscription = port.onReceived((buff) => {
					console.log('Received data:', buff.toString('hex'))
				})

				setSerialPort(port)
				// await port.send('010302BC00288588')
				console.log('hh')

				return () => {
					subscription.remove()
					port.close()
					setSerialPort(null)
				}
			} catch (error) {
				console.error('Error opening serial port:', error)
			}
		}

		setupSerialPort()

		return () => {
			if (serialPort) {
				serialPort.close()
				setSerialPort(null)
			}
		}
	}, [])

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
					console.error('Login failed:', e)
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
							<TouchableOpacity onPress={sendSerialData} style={styles.button}>
								<Text style={styles.buttonText}>Send Serial Command</Text>
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
