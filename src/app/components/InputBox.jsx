import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import tw from 'twrnc'

const InputBox = ({ label, setValue, value }) => {
	return (
		<View style={tw`w-[45%]`}>
			<Text style={tw`text-[30px]  ml-2 mb-3 text-gray-500`}>{label}:</Text>
			{/* <Text
					style={tw`bg-gray-200 text-gray-900 border-0 rounded-md pl-6 w-[370px] h-[100px] mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[74px] font-semibold`}
					// onChangeText={(text) => setValue(text)}
				>
					{value}
				</Text> */}
			<TextInput
			    onChangeText={setValue}
				value={value}
				placeholder="-"
				style={tw`bg-gray-300 text-center text-gray-500 mx-auto bg-slate-200  border border-gray-400 rounded-md pl-6 w-full h-[80px] mb-4 focus:bg-gray-200 flex items-end  text-gray-700 flex pr-7 text-[30px]`}
			/>
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

export default InputBox
