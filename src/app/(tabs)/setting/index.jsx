import FunCard from '@/app/components/FunCard'
import NumberKeyboard from '@/app/components/NumberKeyboard'
import { colors } from '@/constants/tokens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { router, useGlobalSearchParams, useLocalSearchParams, usePathname } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'
const AuthComponent = () => {
	const glob = useGlobalSearchParams()
	const local = useLocalSearchParams()

	const test = usePathname()
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
	const [condi, setCondi] = useState(false)

	const storeFun = useCallback(async (value) => {
		try {
			const jsonValue = JSON.stringify(value)
			await AsyncStorage.setItem('FnKey', jsonValue)
			console.log('stored')
			// Swal.fire({
			// 	title: 'Success!',
			// 	text: 'Data has been saved successfully.',
			// 	icon: 'success',
			// 	confirmButtonText: 'OK',
			// })
			Toast.show({
				type: 'success',
				text1: 'Saved Successfully!',
				text2: 'Fn Key has been saved successfully.',
				// position: 'bottom',
			})
			// SweetAlert.showAlertWithOptions(
			// 	{
			// 		title: 'Success!',
			// 		subTitle: 'Data has been saved successfully.',
			// 		confirmButtonTitle: 'OK',
			// 		confirmButtonColor: '#000',
			// 		// otherButtonTitle: 'Cancel',
			// 		// otherButtonColor: '#dedede',
			// 		style: 'success',
			// 		// cancellable: true,
			// 	},
			// 	(callback) => console.log('callback'),
			// )
		} catch (e) {
			Toast.show({
				type: 'error',
				text1: 'Something was wrong!',
				text2: 'Data has not been saved successfully.',
				// position: 'bottom',
			})
			console.log(e, 'this is error')
		}
	}, [])

	const [receivedData, setReceivedData] = useState('')
	const [location, setLocation] = useState(null)
	const [errorMsg, setErrorMsg] = useState(null)
	const [cardIndex, setCardIndex] = useState()
	const [cardField, setCardField] = useState()

	const handleDataReceived = useCallback(
		(data) => {
			if (test == '/auth') {
				setReceivedData(data)
				router.push('/(tabs)/info')
			}
		},
		[test],
	)

	const handleKeyPressLiter = useCallback((key) => {
		if (key === 'delete') {
			setLiter((prev) => prev.slice(0, -1))
		} else {
			setLiter((prev) => prev + key)
		}
	}, [])

	const handleKeyPressPrice = useCallback((key) => {
		if (key === 'delete') {
			setPrice((prev) => prev.slice(0, -1))
		} else {
			setPrice((prev) => prev + key)
		}
	}, [])

	const handleKeyPress = useCallback(
		(key) => {
			if (key === 'delete') {
				deleteData(cardIndex, cardField)
			} else {
				updateData(cardIndex, cardField, key)
			}
		},
		[cardIndex, cardField],
	)

	useEffect(() => {
		const getCurrentLocation = async () => {
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied')
				return
			}

			let location = await Location.getCurrentPositionAsync({})
			setLocation(location)
		}

		const dataGet = async () => {
			const jsonValue = await AsyncStorage.getItem('FnKey')
			console.log(JSON.parse(jsonValue), 'this is json value')
			console.log('what is that', jsonValue)

			if (JSON.parse(jsonValue) != null) {
				const data = JSON.parse(jsonValue)
				console.log(data[2], 'this is data')
				setFunData(data)
				console.log('wkkkkk')
			} else {
				console.log('wkkkkeeeeeeeeeeeek')
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

		try {
			dataGet()
			getCurrentLocation()
		} catch (e) {
			console.log(e, 'this is error from useEffect')
		}
	}, [condi])

	const [liter, setLiter] = useState('3')
	const [price, setPrice] = useState('3000')
	const [funData, setFunData] = useState()

	const toggleKeyboard = useCallback(() => {
		setIsKeyboardVisible(!isKeyboardVisible)
	}, [isKeyboardVisible])

	const updateData = useCallback((key, field, newValue) => {
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
	}, [])

	const deleteData = useCallback((key, field) => {
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
	}, [])

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<View style={styles.card}>
					<View style={tw` p-4 flex flex-col gap-3 mr-4`}>
						<TouchableOpacity
							onPress={() => router.push(`/(tabs)/setting`)}
							style={tw`flex flex-row w-33  items-start`}
						>
							<Text
								style={tw`text-[20px] font-semibold rounded-md bg-[${colors.primary}] w-full text-center py-4 text-white`}
							>
								FN KEY
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => router.push(`/(tabs)/setting/info`)}
							style={tw`flex flex-row w-33  items-start`}
						>
							<Text
								style={tw`text-[20px] font-semibold rounded-md bg-[${colors.primary}] w-full text-center py-4 text-white`}
							>
								INFO
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => router.push(`/(tabs)/setting/changeMode`)}
							style={tw`flex flex-row w-33  items-start`}
						>
							<Text
								style={tw`text-[20px] font-semibold rounded-md bg-[${colors.primary}] w-full text-center py-4 text-white`}
							>
								Mode
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => router.push(`/(tabs)/setting/priceChg`)}
							style={tw`flex flex-row w-33  items-start`}
						>
							<Text
								style={tw`text-[20px] font-semibold rounded-md bg-[${colors.primary}] w-full text-center py-4 text-white`}
							>
								Price
							</Text>
						</TouchableOpacity>
					</View>
					{funData ? (
						<View style={tw`flex justify-center flex-row items-center gap-8 py-4`}>
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
					) : (
						<View style={tw`flex justify-center w-[80%] flex-row items-center p-20`}>
							<ActivityIndicator animating={true} size={100} color={colors.primary} />
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
		width: 1040,
		display: 'flex',
		flexDirection: 'row',
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	image: {
		flex: 1,
		// justifyContent: 'center',
		paddingTop: 18,
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
