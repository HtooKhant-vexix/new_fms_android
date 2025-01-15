import ControlButton from '@/app/components/ControlButton'
import FunctionKey from '@/app/components/FunctionKey'
import Input from '@/app/components/Input'
import NumberKeyboard from '@/app/components/NumberKeyboard'
import { DevControl, Token } from '@/store/library'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

const index = () => {
	const glob = useGlobalSearchParams()
	const local = useLocalSearchParams()
	const [liter, setLiter] = useState<string>('')
	const [price, setPrice] = useState<string>('')
	const [condi, setCondi] = useState<string>('')
	const [funData, setFunData] = useState<any>({})
	const [type, setType] = useState<string>('')
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

	const { presetFun, error: e, dev } = DevControl()

	// console.log(glob, 'this is glob', price)

	const handleKeyPressLiter = (key: string) => {
		if (key === 'delete') {
			setLiter((prev) => prev.slice(0, -1))
		} else {
			setLiter((prev) => prev + key)
			// setPrice((prev) => ((prev + key) * Number(glob?.price)).toString())
		}
	}

	// const dailyPrice = FuelType?.map((item) => {
	// 	const data = dev?.result
	// 	const unitPrice = data.filter((unit) => unit.fuel_type == item)[0]?.daily_price
	// 	return {
	// 		FuelType: item,
	// 		price: unitPrice,
	// 	}
	// })

	// const pricePerLiter = dev?.result?.filter((unit) => unit.fuel_type == glob?.fuel)[0]?.daily_price

	// console.log(dailyPrice, 'this is daily price', pricePerLiter)

	const handleKeyPressPrice = (key: string) => {
		if (key === 'delete') {
			setPrice((prev) => prev.slice(0, -1))
		} else {
			setPrice((prev) => prev + key)
			// console.log(Number(glob?.price), 'this is price', liter)
			// setLiter((prev) => ((prev + key) / Number(glob?.price)).toString())
		}
	}

	const toggleKeyboard = () => {
		setIsKeyboardVisible(!isKeyboardVisible)
	}

	// console.log(glob, local)

	const { items: token } = Token()

	const FuelType = ['005-Premium Diesel', '004-Diesel', '001-Octane Ron(92)', '002-Octane Ron(95)']

	useEffect(() => {
		try {
			const dataGet = async () => {
				const jsonValue = await AsyncStorage.getItem('FnKey')
				// console.log(JSON.parse(jsonValue), 'this is json value')

				const data = JSON.parse(jsonValue)
				// console.log(data[2], 'this is data')

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
			}
			dataGet()
			// getCurrentLocation()
		} catch (e) {
			console.log(e, 'this is error from useEffect')
		}
	}, [])

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
		// if (priceData) {
		presetFun(route, priceData, token)
		setPrice('')
		setLiter('')
		// } else {
		// presetFun(route, literData, token)
		// }
	}

	const handleStart = () => {
		console.log('start')
	}

	const handleReset = () => {
		console.log('reset')
	}

	const handleClear = () => {
		console.log('clear')
	}

	// {
	//       nozzleNo: obj.nozzle_no,
	//       fuelType: obj.fuel_type,
	//       liter: parseFloat(premitFormInfo.value).toFixed(2),
	//       carNo: !premitFormInfo.carNo == "" ? premitFormInfo.carNo : "-",
	//       vehicleType: premitFormInfo.vehicleType,
	//       cashType: premitFormInfo.cashType,
	//       salePrice: obj.daily_price,
	//       device: "website",
	//       cusCardId: premitFormInfo.cusCardId
	//     },
	//     {
	//       headers: {
	//         Authorization: "Bearer " + token,
	//         "Content-Type": "multipart/form-data", // Adjust content type based on your API requirements
	//       },
	//     }

	const funKeyHandler = (index: number, field: string) => {
		console.log(funData[index], 'this is index and field')
		const data = funData[index]
		if (data.liter == '-') {
			setPrice(data?.price?.toString())
			setLiter((Number(data?.price) / Number(glob?.price)).toString())
		} else {
			setLiter(data?.liter?.toString())
			setPrice((Number(data?.liter) * Number(glob?.price)).toString())
		}
	}

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
							preset={handlePreset}
							start={handleStart}
							reset={handleReset}
							clear={handleClear}
						/>
					</View>
				</View>
				{/* <Keyboard /> */}
				<NumberKeyboard
					isVisible={isKeyboardVisible}
					literValue={liter}
					priceValue={price}
					onKeyPress={condi == 'liter' ? handleKeyPressLiter : handleKeyPressPrice}
					condi={condi}
					// , setLiter((price / Number(glob?.price)).toString())
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
