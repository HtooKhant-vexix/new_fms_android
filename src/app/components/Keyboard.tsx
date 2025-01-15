import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import NumberKeyboard from './NumberKeyboard'

const keyboard: React.FC = () => {
	const [input, setInput] = useState<string>('')
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

	const handleKeyPress = (key: string) => {
		if (key === 'delete') {
			setInput((prev) => prev.slice(0, -1))
		} else {
			setInput((prev) => prev + key)
		}
	}

	const toggleKeyboard = () => {
		setIsKeyboardVisible(!isKeyboardVisible)
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.input}>{input}</Text>
				<TouchableOpacity style={styles.button} onPress={toggleKeyboard}>
					<Text style={styles.buttonText}>Open Number Keyboard</Text>
				</TouchableOpacity>
			</View>
			<NumberKeyboard
				isVisible={isKeyboardVisible}
				onKeyPress={handleKeyPress}
				onClose={() => setIsKeyboardVisible(false)}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		fontSize: 36,
		marginBottom: 20,
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		minWidth: 200,
		textAlign: 'center',
	},
	button: {
		backgroundColor: 'blue',
		padding: 15,
		borderRadius: 5,
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
	},
})

export default keyboard
