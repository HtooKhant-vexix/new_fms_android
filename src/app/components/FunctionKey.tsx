import { colors } from '@/constants/tokens'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'

const FunctionKey = ({ data, onClick }) => {
	return (
		<View style={tw`flex flex-row justify-center items-center gap-16`}>
			{/* [...Array(4)].map((_, index) */}
			{[...Array(4)].map((_, index) => (
				<TouchableOpacity
					onPress={() => onClick(index + 1)}
					key={index}
					style={tw` border border-[${colors.primary}] bg-[#fafafa] p-3 rounded-full`}
				>
					<View
						style={tw`w-20 h-20  bg-white rounded-full border-2 shadow-md shadow-[${colors.primary}] border-[${colors.primary}] flex justify-center items-center`}
					>
						<Text style={tw`text-[40px] font-semibold text-[${colors.primary}]`}>F{index + 1}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	)
}

export default FunctionKey
