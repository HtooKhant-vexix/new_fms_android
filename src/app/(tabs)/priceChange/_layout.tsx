import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

const _layout = () => {
	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</View>
	)
}

export default _layout
