import { colors } from '@/constants/tokens'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
import Toast from 'react-native-toast-message'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'
import { DevControl, nozConfig, Token } from '../../../store/library'
import Input from './Input'

const priceChg = () => {
	const glob = useGlobalSearchParams()
	const local = useLocalSearchParams()
	const [dispensers, setDispensers] = useState([])
	const { items: configNoz } = nozConfig()

	const filData =
		configNoz &&
		JSON.parse(configNoz)?.nozzleConfigs?.map((nozzle) => nozzle?.number.padStart(2, '0'))

	const test = usePathname()
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
	const [condi, setCondi] = useState(false)
	const [funData, setFunData] = useState()
	const [nozOne, setNozOne] = useState()
	const [nozTwo, setNozTwo] = useState()
	const { setToken, items: token, isRefresh } = Token()
	const nozData = dispensers.filter((dispenser) => filData?.includes(dispenser?.nozzle_no))

	const storeFun = async (value) => {
		try {
			const jsonValue = JSON.stringify(value)
			await AsyncStorage.setItem('info', jsonValue)
			Toast.show({
				type: 'success',
				text1: 'Saved Successfully!',
				text2: 'Data has been saved successfully.',
				// position: 'bottom',
			})
			console.log('stored')
		} catch (e) {
			Toast.show({
				type: 'error',
				text1: 'Something was wrong!',
				text2: 'Data has not been saved successfully.',
				// position: 'bottom',
			})
			console.log(e, 'this is error')
		}
	}

	useEffect(() => {
		try {
			const dataGet = async () => {
				const jsonValue = await AsyncStorage.getItem('info')
				console.log(JSON.parse(jsonValue), 'this is json value')

				const data = JSON.parse(jsonValue)

				if (jsonValue) {
					setName(data?.name)
					setAddress(data?.address)
					setCity(data?.city)
					setState(data?.state)
					setPhone1(data?.phone1)
					setPhone2(data?.phone2)
				} else {
					setName('')
					setAddress('')
					setCity('')
					setState('')
					setPhone1('')
					setPhone2('')
				}
			}
			dataGet()
		} catch (e) {
			console.log(e, 'this is error from useEffect')
		}
	}, [condi])

	const [name, setName] = React.useState(funData?.name)
	const [address, setAddress] = React.useState(funData?.address)
	const [city, setCity] = React.useState(funData?.city)
	const [state, setState] = React.useState(funData?.state)
	const [phone1, setPhone1] = React.useState(funData?.phone1)
	const [phone2, setPhone2] = React.useState(funData?.phone2)

	const data = {
		name,
		address,
		city,
		state,
		phone1,
		phone2,
	}

	const { getDev, dev, alert } = DevControl()

	useEffect(() => {
		if (token) {
			getDev(token)
		}
	}, [token])

	useEffect(() => {
		if (dev?.result) {
			setDispensers(dev.result)
		}
	}, [dev])

	console.log('====================================')
	console.log(filData, nozData)
	console.log('====================================')

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

					{/* {funData && ( */}
					<View style={tw`flex w-[825px] items-center gap-8 py-4`}>
						<Text style={tw`text-4xl font-semibold`}>Price Change</Text>
						<View style={tw`flex w-full`}>
							<View style={tw`flex flex-row flex-wrap justify-around h-[70px] w-full`}>
								{nozData?.map((e, index) => (
									<Input key={index} e={e} />
								))}
								{/* <View style={tw`w-[45%]`}>
									<TextInput
										placeholder="Nozzle Two"
										style={tw`w-full text-2xl`}
										onChangeText={(e) => setNozTwo(e)}
										value={nozTwo}
										// right={<TextInput.Icon icon="email" />}
									/>
								</View> */}
							</View>

							{/* <Button
								// icon="camera"
								// loading={true}
								buttonColor={colors.primary}
								mode="contained"
								style={tw`py-2 rounded-md w-[20%] ml-auto mt-18 mr-6 `}
								onPress={() => storeFun(data)}
								uppercase={true}
							>
								Save
							</Button> */}
						</View>
					</View>
					{/* )} */}
				</View>
				{/* {funData && (
                    <NumberKeyboard
                        isVisible={isKeyboardVisible}
                        literValue={funData[cardIndex]?.liter}
                        priceValue={funData[cardIndex]?.price}
                        onKeyPress={handleKeyPress}
                        condi={cardField}
                        onClose={() => setIsKeyboardVisible(false)}
                    />
                )} */}
			</ImageBackground>
		</SafeAreaView>
	)
}

export default priceChg

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
