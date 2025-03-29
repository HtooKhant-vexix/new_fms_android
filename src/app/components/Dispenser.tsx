import { openSerialPort, readMultipleRegisters } from '@/command/controlDispenser'
import { colors } from '@/constants/tokens'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
const Dispenser = ({ title, description, iconSource, price, status, noz, dis, addr }) => {
	// useEffect(() => {
	// 	// readMultipleRegisters(700, 40)
	// 	listenForDispenserData()

	// 	return () => stopListening() // Cleanup when unmounting
	// }, [])

	const serialPort = openSerialPort()

	const nozAddr = addr.filter((e) => e.number == noz)[0].address

	function changeNumber(num, increment) {
		return num + increment
	}
	// console.log(nozAddr, 'gggg', changeNumber(Number(nozAddr),8))

	const [liveData, setLiveData] = React.useState(999.0)
	const [tPrice, setTPrice] = useState(999999)

	let isListening = false
	const read = async () => {
		isListening = true
		try {
			// const data = await serialPort.read()
			// const data = await readMultipleRegisters(704, 2)
			// console.log('Data read from serial port:', data)
			// const floatValue = convertFloat(data[0], data[1])
			// console.log('Converted Float:', floatValue?.toFixed(2))

			while (isListening) {
				try {
					const data = await readMultipleRegisters(changeNumber(Number(nozAddr), 8), 1)
					console.log('Data read from serial port:', data[0], '...')
					setLiveData(data[0])
					setTPrice(data[0] * price)
					// console.log(data[0] * price, 'ggg')
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

	return (
		<View style={styles.card}>
			{/* <View
				style={tw`bg-white border-2 border-blue-300 shadow shadow-xl shadow-[#33b0f9] w-[300px] h-[10px] absolute flex-row  text-center z-20 h-full rounded-full`}
			>
				<View
					style={tw`text-3xl border p-2 mt-1 rounded-full w-16 h-16 mx-auto flex items-center justify-center flex-row font-semibold`}
				>
					<Text style={tw`text-3xl font-semibold`}>{noz}</Text>
				</View>
				<Image
					source={require('../../../assets/gas-fuel.png')} // Replace with your logo
					style={tw`w-12 h-12 mb-6`}
				/>
			</View> */}
			<TouchableOpacity
				onPress={() => {
					// router.push('/(tabs)/(dispenser)/auth'),
					// 	router.setParams({
					// 		noz: noz,
					// 		dis: dis,
					// 		price: price,
					// 		fuel: title,
					// 	})
					read()
					setTimeout(() => {
						isListening = false
					}, 10000)
				}}
				style={styles.cardContent}
			>
				{/* <View style={styles.cardIconContainer}>
					<Image source={iconSource} style={styles.cardIcon} />
				</View>
				<View style={styles.cardTextContainer}>
					<Text style={styles.cardTitle}>{title}</Text>
					<Text style={styles.cardDescription}>{description}</Text>
				</View> */}
				{/* <View style={tw`flex flex-row gap-6 items-center justify-center `}> */}
				{/* <Image
						source={require('../../../assets/gas-fuel.png')} // Replace with your logo
						style={tw`w-12 h-12`}
					/> */}
				{/* <View
						style={tw`text-3xl border p-2 mt-1 rounded-full w-16 h-16 mx-auto flex items-center justify-center flex-row font-semibold`}
					>
						<Text style={tw`text-3xl font-semibold`}>{noz}</Text>
					</View> */}
				{/* <Text style={styles.cardTitle}>{title}</Text> */}
				{/* </View> */}
				<View style={tw`-mt-4`}>
					<Text style={styles.cardDescription}>SALE LITER :</Text>
					<View style={tw`flex bg-gray-900 rounded-lg flex-row gap-2 items-center`}>
						<Text style={styles.liveData}>{liveData?.toFixed(3)}</Text>
					</View>
				</View>
				<View style={tw`mt-[-15px]`}>
					<Text style={styles.cardDescription}>TOTAL PRICE :</Text>
					<View style={tw`flex bg-gray-900 rounded-lg flex-row gap-2 items-center`}>
						<Text style={styles.liveData}>{tPrice}</Text>
					</View>
				</View>
				<View style={tw`mt-[-15px]`}>
					<Text style={styles.cardDescription}>SALE PRICE :</Text>
					<View style={tw`flex bg-gray-900 rounded-lg flex-row gap-2 items-center`}>
						<Text style={styles.liveData}>
							{price}
							{/* {price?.toLocaleString(undefined, {
								maximumFractionDigits: 3,
							})} */}
						</Text>
					</View>
				</View>

				{/* <View style={tw` flex flex-row gap-2 items-center`}> */}
				{/* .toLocaleString(undefined, {
                maximumFractionDigits: 3,
              }) */}
				{/* <Text style={tw` text-[50px] font-bold mb-2  text-[#33b0f9]`}>
					{price?.toLocaleString(undefined, {
						maximumFractionDigits: 3,
					})}
				</Text> */}
				{/* <Text style={tw` text-3xl`}> MMK</Text> */}
				{/* </View> */}
				{/* <View>
				<Text style={tw` text-2xl`}>
					<Text style={tw`font-semibold`}>Status: </Text>
					{status}
				</Text>
			</View> */}
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		width: 540,
		backgroundColor: '#ffffff',
		borderRadius: 12,
		marginHorizontal: 2,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		marginTop: -10,
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
	},
	cardContent: {
		// paddingStart: 100,
		padding: 10,
		paddingVertical: 14,
		// marginTop: -15,
		// height: 540,
		// paddingRight: 20,
		// flexDirection: 'row',
		// alignItems: 'start',
		gap: 20,
	},
	cardIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardIcon: {
		width: 24,
		height: 24,
	},
	cardTextContainer: {
		flex: 1,
	},
	cardTitle: {
		fontSize: 30,
		fontWeight: '600',
		width: '80%',
		// marginBottom: 14,
		backgroundColor: colors.primary,
		display: 'flex',
	},
	liveData: {
		fontSize: 136,
		fontWeight: '600',
		// marginBottom: 4,
		// backgroundColor: colors.primary,
		lineHeight: 132,
		verticalAlign: 'middle',
		marginStart: 'auto',
		marginBottom: -28,
		paddingVertical: 8,
		paddingRight: 6,
		textAlign: 'right',
		color: colors.primary,
	},
	cardDescription: {
		fontSize: 34,
		marginBottom: 4,
		marginRight: 20,
		textAlign: 'right',
		color: colors.text,
	},
})

export default Dispenser
