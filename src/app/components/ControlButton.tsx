import { colors } from '@/constants/tokens'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'

const ControlButton = ({ preset, reset, start, clear }) => {
	const data = [
		{
			name: 'Rest',
			fun: reset,
		},
		{
			name: 'Clear',
			fun: clear,
		},
		{
			name: 'Start',
			fun: start,
		},
		{
			name: 'Preset',
			fun: preset,
		},
	]
	return (
		<View style={tw`flex flex-row justify-center items-center gap-16`}>
			{/* [...Array(4)].map((_, index) */}
			{data.map((e, index) => (
				<TouchableOpacity key={index} onPress={e.fun} style={tw``}>
					<View
						style={tw` h-20  bg-white rounded-xl border-2 shadow-md shadow-[${colors.primary}] border-[${colors.primary}] flex justify-center items-center`}
					>
						<Text style={tw`text-[40px] font-semibold px-10 text-[${colors.primary}]`}>
							{e.name}
						</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	)
}

export default ControlButton
