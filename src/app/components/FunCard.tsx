import { colors } from '@/constants/tokens'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'

const FunCard = ({ onClick, index, data, btn, setIndex, setField }) => {
	const [liter, setLiter] = useState('3')
	const [price, setPrice] = useState('3000')
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
	const [condi, setCondi] = useState<string>('')
	const handleKeyPressLiter = (key: string) => {
		if (key === 'delete') {
			setLiter((prev) => prev.slice(0, -1))
		} else {
			setLiter((prev) => prev + key)
		}
	}

	// console.log(data[index]?.liter)

	const handleKeyPressPrice = (key: string) => {
		if (key === 'delete') {
			setPrice((prev) => prev.slice(0, -1))
		} else {
			setPrice((prev) => prev + key)
		}
	}

	return (
		<>
			<View style={tw`flex flex-row justify-center my-1 items-center gap-8`}>
				<TouchableOpacity
					// key={index}
					onPress={() => console.log('clicked')}
					style={tw` border border-[${colors.primary}] bg-[#fafafa] p-3 rounded-full`}
				>
					<View
						style={tw`w-20 h-20  bg-white rounded-full border-2 shadow-md shadow-[${colors.primary}] border-[${colors.primary}] flex justify-center items-center`}
					>
						<Text style={tw`text-[40px] font-semibold text-[${colors.primary}]`}>F{index}</Text>
					</View>
				</TouchableOpacity>
				<View>
					{/* <Text style={tw`text-[30px] ml-2 mb-2 `}>Liter:</Text> */}
					<TouchableOpacity
						onPress={() => {
							btn(), setField('liter'), setIndex(index)
						}}
					>
						<View
							style={tw`bg-gray-300 mx-auto  border-0 rounded-md pl-6 w-[210px] h-[76px] focus:bg-gray-200 flex items-end `}
						>
							<Text
								style={tw` text-gray-700 flex pr-7  text-[54px] font-semibold`}
								// onChangeText={(text) => setValue(text)}
							>
								{data[index]?.liter}
								{/* 666 */}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View>
					{/* <Text style={tw`text-[30px] ml-2 mb-2 `}>Liter:</Text> */}
					<TouchableOpacity
						onPress={() => {
							btn(), setField('price'), setIndex(index)
						}}
					>
						<View
							style={tw`bg-gray-300 mx-auto  border-0 rounded-md pl-6 w-[280px] h-[76px] focus:bg-gray-200 flex items-end `}
						>
							<Text
								style={tw` text-gray-700 flex  pr-7 text-[54px] font-semibold`}
								// onChangeText={(text) => setValue(text)}
							>
								{data[index]?.price}
								{/* 888 */}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			{/* <View style={tw` absolute right-[-50] top-0 w-[700px] h-[100px]`}>
				<NumberKeyboard
					isVisible={isKeyboardVisible}
					literValue={liter}
					priceValue={price}
					onKeyPress={condi == 'liter' ? handleKeyPressLiter : handleKeyPressPrice}
					condi={condi}
					onClose={() => setIsKeyboardVisible(false)}
				/>
			</View> */}
		</>
	)
}

export default FunCard
