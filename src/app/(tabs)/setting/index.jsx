import FunCard from '@/app/components/FunCard'
import NumberKeyboard from '@/app/components/NumberKeyboard'
import { colors } from '@/constants/tokens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { router, useGlobalSearchParams, useLocalSearchParams, usePathname } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

const AuthComponent = () => {
	const glob = useGlobalSearchParams()
	const local = useLocalSearchParams()

	const test = usePathname()
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
	const [condi, setCondi] = useState(false)

	const storeFun = async (value) => {
		try {
			const jsonValue = JSON.stringify(value)
			await AsyncStorage.setItem('FnKey', jsonValue)
			console.log('stored')
		} catch (e) {
			console.log(e, 'this is error')
		}
	}

	const [receivedData, setReceivedData] = useState('')
	const [location, setLocation] = useState(null)
	const [errorMsg, setErrorMsg] = useState(null)
	const [cardIndex, setCardIndex] = useState()
	const [cardField, setCardField] = useState()

	const handleDataReceived = (data) => {
		if (test == '/auth') {
			setReceivedData(data)
			router.push('/(tabs)/info')
		}
	}

	const handleKeyPressLiter = (key) => {
		if (key === 'delete') {
			setLiter((prev) => prev.slice(0, -1))
		} else {
			setLiter((prev) => prev + key)
		}
	}

	const handleKeyPressPrice = (key) => {
		if (key === 'delete') {
			setPrice((prev) => prev.slice(0, -1))
		} else {
			setPrice((prev) => prev + key)
		}
	}

	const handleKeyPress = (key) => {
		if (key === 'delete') {
			deleteData(cardIndex, cardField)
		} else {
			updateData(cardIndex, cardField, key)
		}
	}

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

		try {
			const dataGet = async () => {
				const jsonValue = await AsyncStorage.getItem('FnKey')
				console.log(JSON.parse(jsonValue), 'this is json value')

				const data = JSON.parse(jsonValue)
				console.log(data[2], 'this is data')

				if (jsonValue) {
					setFunData(data)
				} else {
					setFunData({
						1: {
							liter: '-',
							price: '-',
						},
						2: {
							liter: '-',
							price: '-',
						},
						3: {
							liter: '-',
							price: '-',
						},
						4: {
							liter: '-',
							price: '-',
						},
					})
				}
			}
			dataGet()
			getCurrentLocation()
		} catch (e) {
			console.log(e, 'this is error from useEffect')
		}
	}, [condi])

	const [liter, setLiter] = useState('3')
	const [price, setPrice] = useState('3000')
	const [funData, setFunData] = useState()

	const toggleKeyboard = () => {
		setIsKeyboardVisible(!isKeyboardVisible)
	}

	const updateData = (key, field, newValue) => {
		if (field === 'liter') {
			setFunData((prevData) => ({
				...prevData,
				[key]: {
					...prevData[key],
					[field]: prevData[key][field] + newValue,
					['price']: '-',
				},
			}))
		} else {
			setFunData((prevData) => ({
				...prevData,
				[key]: {
					...prevData[key],
					[field]: prevData[key][field] + newValue,
					['liter']: '-',
				},
			}))
		}
	}

	const deleteData = (key, field) => {
		if (field == 'liter') {
			setFunData((prevData) => ({
				...prevData,
				[key]: {
					...prevData[key],
					[field]: String(prevData[key][field])?.slice(0, -1),
					['price']: '-',
				},
			}))
		} else {
			setFunData((prevData) => ({
				...prevData,
				[key]: {
					...prevData[key],
					[field]: String(prevData[key][field])?.slice(0, -1),
					['liter']: '-',
				},
			}))
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<View style={styles.card}>
					{funData && (
						<View style={tw`flex justify-center flex-row items-center gap-20 py-4`}>
							<View>
								{[...Array(4)].map((e, index) => (
									<FunCard
										onClick={updateData}
										key={index + 1}
										index={index + 1}
										data={funData}
										btn={toggleKeyboard}
										setField={setCardField}
										setIndex={setCardIndex}
									/>
								))}
							</View>

							<TouchableOpacity
								onPress={() => {
									storeFun(funData)
								}}
								style={tw`bg-[${colors.primary}] w-30 h-[90%] rounded-lg flex flex-row justify-center items-center`}
							>
								<Text style={tw`mx-auto text-[30px] text-white font-semibold`}>Save</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
				{funData && (
					<NumberKeyboard
						isVisible={isKeyboardVisible}
						literValue={funData[cardIndex]?.liter}
						priceValue={funData[cardIndex]?.price}
						onKeyPress={handleKeyPress}
						condi={cardField}
						onClose={() => setIsKeyboardVisible(false)}
					/>
				)}
			</ImageBackground>
		</SafeAreaView>
	)
}

export default AuthComponent

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
		width: 950,
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
