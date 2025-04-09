import ControlButton from '@/app/components/ControlButton'
import FunctionKey from '@/app/components/FunctionKey'
import Input from '@/app/components/Input'
import NumberKeyboard from '@/app/components/NumberKeyboard'
import { closeSerialPort, openSerialPort, writeSingleRegister } from '@/command/controlDispenser'
import { colors } from '@/constants/tokens'
import { DevControl } from '@/store/library'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { ActivityIndicator, Modal, Portal } from 'react-native-paper'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'
import { permitCommand, presetCommand } from '../../../command/control'

const index = () => {
	const glob = useGlobalSearchParams()
	const local = useLocalSearchParams()
	const [liter, setLiter] = useState<string>('')
	const [price, setPrice] = useState<string>('')
	const [condi, setCondi] = useState<string>('')
	const [funData, setFunData] = useState<any>({})
	const [type, setType] = useState<string>('')
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

	const { presetFun, error: e, dev, presetLoading, permitLoading, permitFun, alert } = DevControl()

	const handleKeyPressLiter = (key: string) => {
		if (key === 'delete') {
			setLiter((prev) => prev.slice(0, -1))
		} else {
			setLiter((prev) => prev + key)
		}
	}

	const [isDirectMode, setIsDirectMode] = useState(false)
	// const router = useRouter()
	// console.log(isDirectMode, '---- this is mode')

	useEffect(() => {
		const loadMode = async () => {
			try {
				const storedMode = await AsyncStorage.getItem('Mode')
				console.log(storedMode, 'this is stored mode')
				if (storedMode !== null) {
					setIsDirectMode(storedMode === 'Direct')
				}
			} catch (error) {
				console.error('Error loading mode:', error)
			}
		}
		loadMode()
	})

	const handleKeyPressPrice = (key: string) => {
		if (key === 'delete') {
			setPrice((prev) => prev.slice(0, -1))
		} else {
			setPrice((prev) => prev + key)
		}
	}

	const setupSerial = async () => {
		const isOpen = await openSerialPort()
		if (isOpen) {
			await writeSingleRegister(734, 0) // Example: Write value 3000 to register 728
			await closeSerialPort()
			console.log('clicked')
		}
	}

	const toggleKeyboard = () => {
		setIsKeyboardVisible(!isKeyboardVisible)
	}
	const [token, setToken] = useState('')
	// console.log(token, 'this is token kkkkk')

	useEffect(() => {
		const fetchToken = async () => {
			try {
				const credentials = await Keychain.getGenericPassword()
				if (credentials && credentials.password) {
					setToken(credentials.password) // Store the token in state
					// console.log('Token retrieved:', credentials.password)
				} else {
					console.log('No token found')
				}
			} catch (error) {
				console.error('Error retrieving token', error)
			}
		}

		fetchToken() // Call the async function inside useEffect
	}, [])

	// const { items: token } = Token()
	// const token = getToken()

	const FuelType = ['005-Premium Diesel', '004-Diesel', '001-Octane Ron(92)', '002-Octane Ron(95)']

	useEffect(() => {
		const dataGet = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem('FnKey')
				const data = JSON.parse(jsonValue)
				if (jsonValue) {
					setFunData(data)
				} else {
					setFunData({
						1: {
							liter: 0,
							price: 0,
						},
						2: {
							liter: 0,
							price: 0,
						},
						3: {
							liter: 0,
							price: 0,
						},
						4: {
							liter: 0,
							price: 0,
						},
					})
				}
			} catch (e) {
				console.log(e, 'this is error from useEffect')
			}
		}
		dataGet()
	}, [])

	console.log(glob, 'this is glob')

	const literData = {
		nozzleNo: glob?.noz,
		fuelType: glob?.fuel,
		liter: parseFloat(liter).toFixed(2),
		carNo: glob?.number,
		vehicleType: glob?.category,
		cashType: glob?.payment,
		salePrice: glob?.price,
		device: 'android module',
		cusCardId: '-',
	}

	const priceData = {
		nozzleNo: glob?.noz,
		fuelType: glob?.fuel,
		kyat: Number(price),
		carNo: glob?.number,
		vehicleType: glob?.category,
		cashType: glob?.payment,
		salePrice: glob?.price,
		device: 'android module',
		cusCardId: '-',
	}

	const handlePreset = () => {
		const route = `detail-sale/preset?depNo=${glob?.dis}&nozzleNo=${glob?.noz}`
		presetFun(route, priceData, token)
		setPrice('')
		setLiter('')
	}

	useEffect(() => {
		if (presetLoading) {
			showModal()
			// setSnackVisible(true)
		} else {
			hideModal()
			// setSnackVisible(false)
		}
	}, [presetLoading])

	const containerStyle = { backgroundColor: 'white', padding: 20 }

	const permitObj = {
		nozzleNo: glob?.noz,
		fuelType: glob?.fuel,
		carNo: glob?.number,
		vehicleType: glob?.category,
		cashType: glob?.payment,
		device: 'android module',
	}

	const handleStart = () => {
		console.log(token, '.......')
		const route = `detail-sale?depNo=${glob?.dis}&nozzleNo=${glob?.noz}`
		permitFun(route, permitObj, token)
		setPrice('')
		setLiter('')
	}

	const handleReset = () => {
		console.log('reset')
	}

	const handleClear = () => {
		setLiter('')
		setPrice('')
	}

	// console.log(presetLoading, 'presetLoading')

	const funKeyHandler = (index: number, field: string) => {
		// console.log(funData[index], 'this is index and field')
		const data = funData[index]
		if (data.liter == '-') {
			setPrice(data?.price?.toString())
			setLiter((Number(data?.price) / Number(glob?.price)).toString())
		} else {
			setLiter(data?.liter?.toString())
			setPrice((Number(data?.liter) * Number(glob?.price)).toString())
		}
	}

	const [visible, setVisible] = React.useState(false)

	const showModal = () => setVisible(true)
	const hideModal = () => setVisible(false)
	// console.log(liter?.toFixed(2), 'this is liter')

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<View style={tw`mt-[-60px]`}>
					<View>
						<FunctionKey data={funData} onClick={funKeyHandler} />
					</View>
					<View
						style={tw`px-10 py-8 my-6 flex gap-4 flex-row rounded-xl justify-center bg-white mx-auto bg-white`}
					>
						<Input
							onPress={() => {
								toggleKeyboard(), setCondi('price'), setType('price')
							}}
							label="Price"
							value={price}
							setValue={setPrice}
						/>
						<Input
							label="Liter"
							onPress={() => {
								toggleKeyboard(), setCondi('liter'), setType('liter')
							}}
							value={liter}
							setValue={setLiter}
						/>
					</View>
					<View>
						<ControlButton
							preset={
								isDirectMode
									? () => {
											handlePreset(), presetCommand(Number(liter)?.toFixed(2))
										}
									: handlePreset
							}
							start={
								isDirectMode
									? () => {
											handleStart(), permitCommand()
										}
									: handleStart
							}
							clear={handleClear}
						/>
					</View>
				</View>
				<NumberKeyboard
					isVisible={isKeyboardVisible}
					literValue={liter}
					priceValue={price}
					onKeyPress={condi == 'liter' ? handleKeyPressLiter : handleKeyPressPrice}
					condi={condi}
					onClose={() => {
						if (type === 'liter') {
							setIsKeyboardVisible(false),
								setPrice((Number(liter) * Number(glob?.price)).toString())
						} else {
							setIsKeyboardVisible(false),
								setLiter((Number(price) / Number(glob?.price)).toString())
						}
					}}
				/>
				{presetLoading && (
					<Portal>
						<Modal
							visible={visible}
							onDismiss={hideModal}
							contentContainerStyle={tw`bg-white flex mx-auto rounded-lg`}
						>
							<View style={tw`flex justify-center items-center p-20`}>
								<ActivityIndicator animating={true} size={100} color={colors.primary} />
								<Text style={tw`text-4xl mt-6`}>Please wait ....</Text>
							</View>
						</Modal>
					</Portal>
				)}
			</ImageBackground>
		</SafeAreaView>
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
		margin: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
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

export default index
