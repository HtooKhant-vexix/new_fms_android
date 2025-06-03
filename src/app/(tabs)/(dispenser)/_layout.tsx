import { nozConfig } from '@/store/library'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

const DispenserLayout = () => {
	const { getConfig } = nozConfig()
	useEffect(() => {
		getConfig()
	}, [])
	// const { setToken, items } = Token()

	// const getToken = async () => {
	// 	try {
	// 		const credentials = await Keychain.getGenericPassword()
	// 		if (credentials) {
	// 			const token = credentials.password
	// 			// console.log('Token retrieved:', token)
	// 			setToken(token)
	// 			return token
	// 		} else {
	// 			console.log('No token found')
	// 			return null
	// 		}
	// 	} catch (error) {
	// 		console.error('Error retrieving token', error)
	// 	}
	// }

	// useEffect(() => {
	// 	getToken()
	// }, [])

	// console.log(items, 'this is test')

	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="auth"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="fail"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="login"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</View>
	)
}

export default DispenserLayout
