import * as Keychain from 'react-native-keychain'

export async function storeToken(token) {
	try {
		let options: Keychain.Options = { storage: Keychain.STORAGE_TYPE.FB }
		await Keychain.setGenericPassword('auth_token', token, options)
		console.log('Token saved securely')
	} catch (error) {
		console.error('Error saving token', error)
	}
}

export async function getToken() {
	// const { setToken, items } = Token()
	try {
		const credentials = await Keychain.getGenericPassword()
		if (credentials) {
			const token = credentials.password
			// console.log('Token retrieved:', token)

			// setToken(token)
			return credentials
		} else {
			console.log('No token found')
			return null
		}
	} catch (error) {
		console.error('Error retrieving token', error)
	}
}

export const colors = {
	background: '#fff',
	primary: '#33b0f9',
	text: '#000',
	textMuted: '#9ca3af',
	icon: '#fff',
	maximumTrackTintColor: 'rgba(255,255,255,0.4)',
	minimumTrackTintColor: 'rgba(255,255,255,0.6)',
}

export const fontSize = {
	xs: 12,
	sm: 16,
	base: 20,
	lg: 24,
}

export const screenPadding = {
	horizontal: 24,
}
