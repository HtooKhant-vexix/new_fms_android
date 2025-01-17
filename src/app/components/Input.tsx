import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'

const Input = ({ label, setValue, onPress, value, style }) => {
	return (
		<View>
			<Text style={tw`text-[30px] ml-2 mb-2 `}>{label}:</Text>
			<TouchableOpacity onPress={onPress}>
				{/* <Text
					style={tw`bg-gray-200 text-gray-900 border-0 rounded-md pl-6 w-[370px] h-[100px] mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[74px] font-semibold`}
					// onChangeText={(text) => setValue(text)}
				>
					{value}
				</Text> */}
				<View
					style={tw`bg-gray-300 mx-auto  border-0 rounded-md pl-6 w-[370px] h-[100px] mb-4 focus:bg-gray-200 flex items-end ${style}`}
				>
					<Text
						style={tw` text-gray-700 flex  pr-7  text-[74px] font-semibold`}
						// onChangeText={(text) => setValue(text)}
					>
						{value}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	input: {
		width: 300,
		height: 80,
		borderRadius: 10,
		backgroundColor: 'gray',
	},
})

export default Input
