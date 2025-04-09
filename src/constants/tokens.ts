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
	try {
		const credentials = await Keychain.getGenericPassword()
		if (credentials && credentials.password) {
			const token = credentials.password // Extract the actual token
			// console.log('Token retrieved:', token)
			return token // Return the extracted token
		} else {
			console.log('No token found')
			return null
		}
	} catch (error) {
		console.error('Error retrieving token', error)
		return null
	}
}

export const colors = {
	background: '#fff',
	primary: '#0059f4',
	data: '#003b8f',
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
