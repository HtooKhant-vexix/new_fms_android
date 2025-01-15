import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const DispenserLayout = () => {
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
			</Stack>
		</View>
	)
}

export default DispenserLayout
