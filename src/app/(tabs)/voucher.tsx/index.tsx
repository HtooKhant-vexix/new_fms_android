import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const index = () => {
	return (
		<View>
			<Text>voucher</Text>
			<Link href="/(tabs)/(dispenser)">click here</Link>
		</View>
	)
}

export default index
