import { colors } from '@/constants/tokens'
import React, { useEffect, useRef, useState } from 'react'
// import Dropdown from 'react-dropdown'
// import 'react-dropdown/style.css'
// import { FaAngleDown } from 'react-icons/fa'
import {
	Animated,
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import tw from 'twrnc'

const SelectDrop = ({ data, value, setValue, placeholder, label }) => {
	const [con, setCon] = useState(false)
	//   const [value, setValue] = useState("");
	//   const [name, setName] = useState("");
	const options = ['one', 'two', 'three']
	const defaultOption = options[0]

	const pfp = {
		open: { opacity: 1 },
		close: { opacity: 0 },
		duration: 10,
	}

	const { height } = Dimensions.get('window')

	const slideAnim = useRef(new Animated.Value(height)).current
	const opacityAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		if (con) {
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: 110,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(opacityAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start()
		} else {
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: 100,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(opacityAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start()
		}
	}, [con, slideAnim, opacityAnim])

	// console.log("====================================");
	// console.log(value);
	// console.log("====================================");

	return (
		<View style={tw`w-[45%] relative`}>
			<Text style={tw` text-gray-500 mb-3 pl-2 text-[30px]`}>{label}</Text>
			<TouchableOpacity
				onPress={() => setCon((pre) => !pre)}
				style={tw`bg-slate-200  border border-gray-400 h-[80px]  items-center w-full p-4 flex justify-between items-center rounded-lg`}
			>
				<Text style={tw`text-3xl flex justify-center pt-2`}>
					{value?.label ? value?.label : placeholder ? placeholder : 'Please Select'}
				</Text>
				{/* <FaAngleDown className="text-text" /> */}
			</TouchableOpacity>
			{/* {con && ( */}
			{/* )} */}
			{con && (
				<Animated.View
					style={[
						styles.kcontainer,
						{
							transform: [{ translateY: slideAnim }],
							opacity: opacityAnim,
						},
					]}
					visible={con}
				>
					<ScrollView
						// initial={{ opacity: 0 }}
						// whileInView={{
						// 	opacity: 1,
						// 	transition: { duration: 0.15 },
						// }}
						style={tw` bg-[#eff7f6] p-3 z-50 pb-34 border border-inputB w-full flex-1 mt-1 rounded-xl `}
					>
						<View style={tw``}>
							<TouchableOpacity
								onPress={() => setCon((pre) => !pre)}
								style={tw`bg-[${colors.primary}] w-full p-2 rounded-lg mb-2 `}
							>
								<Text style={tw`text-2xl text-center py-3 text-white text-2xl`}>Back</Text>
							</TouchableOpacity>
						</View>
						<View style={tw`pb-8`}>
							{data.map((item, index) => (
								<View key={index}>
									<TouchableOpacity
										onPress={() => {
											setCon(false)
											setValue(item)
										}}
										style={tw`ps-4 mb-1 bg-secondary pl-6 my-2 rounded-lg border py-4 text-[30px] duration-100`}
									>
										<Text style={tw`text-2xl`}>{item.label}</Text>
									</TouchableOpacity>
								</View>
							))}
						</View>
					</ScrollView>
				</Animated.View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	kcontainer: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		// backgroundColor: 'red',
		zIndex: 30,
		height: 300,
		// padding: 20,
		// justifyContent: 'center',
	},
	closeButton: {
		position: 'absolute',
		top: 76,
		left: 40,
		paddingHorizontal: 26,
		paddingVertical: 10,
		backgroundColor: colors.primary,
		borderRadius: 8,
	},
	closeButtonText: {
		fontSize: 26,
		color: 'white',
	},
	keypadContainer: {
		marginTop: 320,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	key: {
		width: '30%',
		aspectRatio: 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		margin: 5,
		borderRadius: 5,
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	keyText: {
		fontSize: 24,
		fontWeight: 'bold',
	},
})

export default SelectDrop
