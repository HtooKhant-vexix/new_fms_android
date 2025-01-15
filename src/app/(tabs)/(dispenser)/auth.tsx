import { localInstance } from '@/api/axios'
import { colors } from '@/constants/tokens'
import { Auth } from '@/store/library'
import * as Location from 'expo-location'
import { router, useGlobalSearchParams, useLocalSearchParams, usePathname } from 'expo-router'
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

const AuthComponent = () => {
	let start = new Date()
	start.setHours(0)
	start.setMinutes(0)
	start.setSeconds(0)
	start = new Date(start)

	let end = new Date()
	end.setHours(23)
	end.setMinutes(59)
	end.setSeconds(59)
	end = new Date(end)

	const route = `detail-sale/pagi/by-date/1?sDate=${start}&eDate=${end}`
	const [serialPort, setSerialPort] = useState<any>(null)

	useEffect(() => {
		const setupSerialPort = async () => {
			try {
				console.log('start pro')
				const port = await SerialPortAPI.open('/dev/ttyS8', {
					baudRate: 9600,
				})
				console.log('serial port open', port)
				// console.log(port);
				// Check if the serial port is open
				if (port && test == '/auth') {
					// console.log("Serial port is open");
					// Subscribe to received data
					const subscription = port.onReceived(async (buff) => {
						console.log('====================================')
						console.log(buff.toString('ascii'))
						console.log('===========u=========================')
						const data = buff.toString('ascii')
						// const formData = new FormData()
						// console.log(data)
						if (data) {
							const body = {
								cardId: data.replace(/\s+/g, ''),
							}

							// authPost(`/user/cardAuth`, body)
							localInstance
								.post(`/user/cardAuth`, body, {
									headers: {
										// Authorization: 'Bearer ' + token,
										'Content-Type': 'multipart/form-data',
									},
								})
								.then((res) => {
									// console.log(res?.data?.result?.token)
									// const token = res?.data?.result?.token
									// storeToken(token)
									port.close()
									if (res?.data?.con) {
										router.push('/(tabs)/info')
										router.setParams({
											dis: glob?.dis,
											noz: glob?.noz,
											price: glob?.price,
											fuel: glob.fuel,
										})
									}
									// dispatch({ type: 'fetch-data', payload: res.data })
								})
								.catch((e) => {
									// dispatch({ type: 'error', payload: e })
									console.log(e)
									router.push('/(tabs)/(dispenser)/fail')
								})
						}
					})
					setSerialPort(port)
					// Remember to close the port and unsubscribe when the component unmounts
					return () => {
						// console.log("port close");
						subscription.remove()
						port.close()
						serialPort(null)
					}
				} else {
					console.log('Failed to open the serial port')
				}
			} catch (error) {
				console.log('Error opening the serial port:', error)
			}
		}

		// Call the setup function
		setupSerialPort()
		return () => {
			if (serialPort) {
				serialPort.close()
				setSerialPort(null)
			}
		}
	}, [])

	const glob = useGlobalSearchParams()
	const local = useLocalSearchParams()

	const test = usePathname()
	console.log(test)

	console.log('Local:', local, 'Global:', glob)

	const { items, isLoading, error, authPost } = Auth()

	const [receivedData, setReceivedData] = useState('')
	const [location, setLocation] = useState<Location.LocationObject | null>(null)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	// const handleDataReceived = (data) => {
	// 	if (test == '/auth') {
	// 		const body = {
	// 			cardId: data,
	// 		}
	// 		setReceivedData(body)
	// 		authPost(`user/cardAuth`, data)
	// 		// console.log(data, 'this is data')
	// 		// router.push('/(tabs)/info')
	// 	}
	// }
	console.log(items, error, isLoading)

	useEffect(() => {
		async function getCurrentLocation() {
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied')
				return
			}

			let location = await Location.getCurrentPositionAsync({})
			setLocation(location)
		}

		getCurrentLocation()
	}, [])

	// test == '/auth'  useSerialPort('/dev/ttyS8', 9600, handleDataReceived, 'ascii')
	// useEffect(() => {
	// }, [])
	// console.log(receivedData, 'this is data', location)

	return (
		<>
			<SafeAreaView style={styles.container}>
				<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
					<View style={styles.card}>
						{/* <Text style={styles.title}>Authentication for nozzle 02</Text> */}
						<View style={styles.contentContainer}>
							<Image source={require('../../../../assets/rfid.png')} style={styles.image1} />
							<View style={styles.textContainer}>
								<View style={tw`mt-3`}>
									<Text style={tw`text-[25px] text-slate-700 ml-2 mb-3`}>
										Authentication for nozzle {glob?.nozzle}
									</Text>
									<Text style={tw`text-[36px] font-semibold text-[${colors.primary}]`}>
										Tap Cashier Card On Card Reader To Unlock The Dispenser
									</Text>
									<Text style={tw`text-[30px]`}></Text>
								</View>
								<TouchableOpacity
									onPress={() => router.push('/(tabs)/(dispenser)/home')}
									style={styles.button}
								>
									<Text style={styles.buttonText}>Back to Home</Text>
								</TouchableOpacity>
							</View>
							{/* <Text>Received Data: {receivedData}</Text>
							<SerialPortComponent
								portName="/dev/ttyS8"
								baudRate={38400}
								onDataReceived={handleDataReceived}
							/> */}
						</View>
					</View>
				</ImageBackground>
			</SafeAreaView>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		// margin: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		marginTop: -30,
		marginHorizontal: 'auto',
		width: 800,
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	image: {
		flex: 1,
		justifyContent: 'center',
	},
	title: {
		fontSize: 24,
		marginStart: 15,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	contentContainer: {
		flexDirection: 'row',
		gap: 16,
	},
	image1: {
		width: 280,
		height: 280,
		borderRadius: 8,
	},
	textContainer: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: 10,
	},
	paragraph: {
		fontSize: 16,
		lineHeight: 24,
		color: '#666',
	},
	button: {
		backgroundColor: '#007AFF',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 16,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})

export default AuthComponent
