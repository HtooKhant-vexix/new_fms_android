import SelectDrop from '@/app/components/SelectDrop'
import backImg from '@/assets/bg.png'
import { categories, paymentType } from '@/constants/data'
import { colors } from '@/constants/tokens'
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import {
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import tw from 'twrnc'
import InputBox from '../../components/InputBox'
const CardComponent = () => {
	const glob = useGlobalSearchParams()
	const local = useLocalSearchParams()

	// console.log('Local:', local, 'Global:', glob)
	const [category, setCategory] = useState({ label: 'Cycle', value: 1 })
	const [number, setNumber] = useState()

	const [payment, setPayment] = useState({
		id: 1,
		label: 'Cash',
		value: 'Cash',
	})

	const data = {
		payment: payment?.value,
		number: number?number: '-',
		category: category?.label,
		dis: glob?.dis,
		noz: glob?.noz,
		price: glob?.price,
		fuel: glob.fuel,
	}

	return (
		<>
			<SafeAreaView style={styles.container}>
				<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
					<View style={styles.card}>
						{/* <Text style={styles.title}>Authentication for nozzle 02</Text> */}
						<SelectDrop
							placeholder="-"
							label="Vehicle Type :"
							data={categories}
							value={category}
							setValue={setCategory}
						/>
						<SelectDrop
							placeholder="-"
							label="Payment Type"
							data={paymentType}
							value={payment}
							setValue={setPayment}
						/>
						<InputBox setValue={setNumber} value={number}  label="Vehicle Number" />
						<TouchableOpacity
							onPress={() => router.push('/(tabs)/info/auth')}
							style={tw`w-[45%] border-2 border-[${colors.primary}] mt-12 rounded-md flex items-center justify-center  h-[80px]`}
						>
							<Text style={tw`text-2xl text-[${colors.primary}] `}>Use Member Card</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								router.push('/(tabs)/preset'), router.setParams(data)
								setCategory({ label: 'Cycle', value: 1 })
								setPayment({
									id: 1,
									label: 'Cash',
									value: 'Cash',
								})
								setNumber()
							}}
							style={tw`w-[96%] bg-[${colors.primary}] rounded-md flex items-center justify-center  h-[80px]`}
						>
							<Text style={tw`text-2xl text-white `}>Next</Text>
						</TouchableOpacity>
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
		margin: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		paddingVertical: 30,
		marginHorizontal: 'auto',
		width: 900,
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		display: 'flex',
		justifyContent: 'space-around',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 20,
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

export default CardComponent
