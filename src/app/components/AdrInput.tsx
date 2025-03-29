import { View, Text, TextInput, StyleSheet } from 'react-native'

interface NozzleAddressInputProps {
	index: number
	numberValue: string
	addressValue: string
	onChange: (index: number, field: 'number' | 'address', value: string) => void
}

// Update the component to handle both number and address
export default function NozzleAddressInput({
	index,
	numberValue,
	addressValue,
	onChange,
}: NozzleAddressInputProps) {
	// Handle number input with validation
	const handleNumberChange = (text: string) => {
		// Only allow numbers
		if (/^\d*$/.test(text)) {
			onChange(index, 'number', text)
		}
	}

	// Handle address input with validation
	const handleAddressChange = (text: string) => {
		// Only allow numbers
		if (/^\d*$/.test(text)) {
			onChange(index, 'address', text)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Nozzle {index + 1} Configuration:</Text>
			<View style={styles.row}>
				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Number:</Text>
					<TextInput
						style={styles.input}
						value={numberValue}
						onChangeText={handleNumberChange}
						placeholder="Nozzle #"
						// keyboardType="numeric"
						maxLength={2}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Address:</Text>
					<TextInput
						style={styles.input}
						value={addressValue}
						onChangeText={handleAddressChange}
						placeholder="Address (e.g., 00800)"
						// keyboardType="numeric"
						maxLength={5}
					/>
				</View>
			</View>
		</View>
	)
}

// Update the styles
const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
		backgroundColor: '#f9f9f9',
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#eee',
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		fontWeight: '600',
		color: '#555',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	inputContainer: {
		flex: 1,
		marginHorizontal: 4,
	},
	inputLabel: {
		fontSize: 14,
		marginBottom: 4,
		color: '#666',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 10,
		fontSize: 16,
		backgroundColor: '#fff',
	},
})
