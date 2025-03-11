import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const HiddenRFIDInput = ({ onRFIDScan }) => {
	const inputRef = useRef(null)
	const [rfidData, setRfidData] = useState('')
	const typingTimeout = useRef(null)

	useEffect(() => {
		// Ensure the input is focused when mounted
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus()
			}
		}, 500)
	}, [])

	const handleRFIDInput = (text) => {
		if (typeof text !== 'string') return // Ensure text is always a string
		setRfidData(text)

		// Clear previous timeout
		if (typingTimeout.current) {
			clearTimeout(typingTimeout.current)
		}

		// Set a timeout to process RFID input after 300ms of inactivity
		typingTimeout.current = setTimeout(() => {
			if (text.trim().length > 0) {
				onRFIDScan(text.trim()) // Process RFID scan
				setRfidData('') // Clear input for next scan
			}
		}, 300) // Adjust delay if necessary
	}

	return (
		<View style={styles.container}>
			<TextInput
				ref={inputRef}
				value={rfidData}
				onChangeText={handleRFIDInput}
				autoFocus
				// showSoftInputOnFocus={false} // Prevent keyboard from showing
				keyboardType="numeric"
				returnKeyType="done"
				blurOnSubmit={false}
				// editable={false} // Prevent user from manually typing
				style={styles.hiddenInput}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: 0,
		height: 0,
		opacity: 0,
		position: 'absolute',
	},
	hiddenInput: {
		width: 1,
		height: 1,
		opacity: 0,
		position: 'absolute',
	},
})

export default HiddenRFIDInput
