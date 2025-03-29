'use client'

import { nozConfig, Token } from '@/store/library'
import { useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import NozzleAddressInput from './AdrInput'

// Define the steps in our wizard
enum SetupStep {
	NOZZLE_COUNT = 0,
	NOZZLE_ADDRESSES = 1,
	COMPLETE = 2,
}

export default function SetupWizard() {
	const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.NOZZLE_COUNT)
	const [nozzleCount, setNozzleCount] = useState<string>('')
	// Update the nozzleAddresses state to store both number and address
	const [nozzleConfigs, setNozzleConfigs] = useState<Array<{ number: string; address: string }>>([])
	const { setConfig, items } = nozConfig()
	const { refresh, isRefresh } = Token()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	console.log(items, 'this is token')
	// Handle nozzle count input
	const handleNozzleCountChange = (text: string) => {
		// Only allow numbers
		if (/^\d*$/.test(text)) {
			setNozzleCount(text)
		}
	}

	// Update the goToAddressStep function
	const goToAddressStep = () => {
		const count = Number.parseInt(nozzleCount, 10)
		if (isNaN(count) || count <= 0) {
			Alert.alert('Invalid Input', 'Please enter a valid number of nozzles.')
			return
		}

		// Initialize the nozzle configs array with empty values
		setNozzleConfigs(Array(count).fill({ number: '', address: '' }))
		setCurrentStep(SetupStep.NOZZLE_ADDRESSES)
	}

	// Update the updateNozzleAddress function to updateNozzleConfig
	const updateNozzleConfig = (index: number, field: 'number' | 'address', value: string) => {
		const updatedConfigs = [...nozzleConfigs]
		updatedConfigs[index] = {
			...updatedConfigs[index],
			[field]: value,
		}
		setNozzleConfigs(updatedConfigs)
	}

	// Update the saveConfiguration function to show an alert on success
	const saveConfiguration = async () => {
		// Validate all numbers and addresses are filled
		if (nozzleConfigs.some((config) => !config.number || !config.address)) {
			Alert.alert('Missing Information', 'Please enter both number and address for all nozzles.')
			return
		}

		setIsLoading(true)
		try {
			const config = {
				nozzleCount: Number.parseInt(nozzleCount, 10),
				nozzleConfigs,
			}
			setConfig(config)
			// await AsyncStorage.setItem('fuelDispenserConfig', JSON.stringify(config))

			// Show success alert
			Alert.alert('Success', 'Configuration successfully saved to device storage!', [
				{
					text: 'OK',
					onPress: () => setCurrentStep(SetupStep.COMPLETE),
				},
			])
			// Alert.alert('Success', 'Configuration successfully saved to device storage!', [
			// 	{
			// 		text: 'OK',
			// 		onPress: () => {
			// 			setCurrentStep(SetupStep.COMPLETE)
			// 			router.push('/(tabs)/(dispenser)') // Navigate to the dispenser screen
			// 		},
			// 	},
			// ])
		} catch (error) {
			Alert.alert('Error', 'Failed to save configuration. Please try again.')
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	// Update the resetWizard function
	const resetWizard = () => {
		setNozzleCount('')
		setNozzleConfigs([])
		setCurrentStep(SetupStep.NOZZLE_COUNT)
		// router.push('/(tabs)/(dispenser)')
		refresh(!isRefresh)

		console.log('click')
	}

	// Render the appropriate step
	const renderStep = () => {
		switch (currentStep) {
			case SetupStep.NOZZLE_COUNT:
				return (
					<View style={styles.stepContainer}>
						<Text style={styles.title}>Fuel Dispenser Setup</Text>
						<Text style={styles.stepTitle}>Step 1: Number of Nozzles</Text>
						<Text style={styles.description}>
							Enter the total number of nozzles for your fuel dispenser.
						</Text>
						<TextInput
							style={styles.input}
							value={nozzleCount}
							onChangeText={handleNozzleCountChange}
							placeholder="Enter number of nozzles"
							// keyboardType="numeric"
							maxLength={2}
						/>
						<TouchableOpacity
							style={[styles.button, !nozzleCount ? styles.buttonDisabled : null]}
							onPress={goToAddressStep}
							disabled={!nozzleCount}
						>
							<Text style={styles.buttonText}>Next</Text>
						</TouchableOpacity>
					</View>
				)

			// Update the NOZZLE_ADDRESSES case in renderStep function to use the new NozzleAddressInput
			case SetupStep.NOZZLE_ADDRESSES:
				return (
					<View style={styles.stepContainer}>
						<Text style={styles.title}>Fuel Dispenser Setup</Text>
						<Text style={styles.stepTitle}>Step 2: Nozzle Configuration</Text>
						<Text style={styles.description}>
							Enter the number and address for each nozzle (e.g., Number: 1, Address: 00800).
						</Text>
						<ScrollView style={styles.scrollContainer}>
							{nozzleConfigs.map((config, index) => (
								<NozzleAddressInput
									key={index}
									index={index}
									numberValue={config.number}
									addressValue={config.address}
									onChange={updateNozzleConfig}
								/>
							))}
						</ScrollView>
						<View style={styles.buttonRow}>
							<TouchableOpacity
								style={[styles.button, styles.secondaryButton]}
								onPress={() => setCurrentStep(SetupStep.NOZZLE_COUNT)}
							>
								<Text style={styles.secondaryButtonText}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={saveConfiguration}
								disabled={isLoading}
							>
								{isLoading ? (
									<ActivityIndicator color="#fff" />
								) : (
									<Text style={styles.buttonText}>Save Configuration</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				)

			// Update the COMPLETE case in renderStep to display both number and address
			case SetupStep.COMPLETE:
				return (
					<View style={styles.stepContainer}>
						<Text style={styles.title}>Setup Complete!</Text>
						<Text style={styles.description}>
							Your fuel dispenser has been successfully configured with {nozzleCount} nozzles.
						</Text>
						<Text style={styles.configSummary}>Configuration Summary:</Text>
						<ScrollView style={styles.scrollContainer}>
							{nozzleConfigs.map((config, index) => (
								<View key={index} style={styles.summaryItem}>
									<Text style={styles.summaryText}>
										Nozzle {index + 1}: Number {config.number}, Address {config.address}
									</Text>
								</View>
							))}
						</ScrollView>
						<TouchableOpacity style={styles.button} onPress={resetWizard}>
							<Text style={styles.buttonText}>Start Over</Text>
						</TouchableOpacity>
					</View>
				)
		}
	}

	return <View style={styles.container}>{renderStep()}</View>
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	stepContainer: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
		color: '#333',
	},
	stepTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 10,
		color: '#555',
	},
	description: {
		fontSize: 16,
		marginBottom: 20,
		color: '#666',
		lineHeight: 22,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		marginBottom: 20,
		backgroundColor: '#f9f9f9',
	},
	button: {
		backgroundColor: '#2196F3',
		borderRadius: 8,
		padding: 15,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonDisabled: {
		backgroundColor: '#B0BEC5',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	scrollContainer: {
		flex: 1,
		marginBottom: 20,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 45,
	},
	secondaryButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#2196F3',
	},
	secondaryButtonText: {
		color: '#2196F3',
		fontSize: 16,
		fontWeight: '600',
	},
	configSummary: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 10,
		marginTop: 10,
		color: '#555',
	},
	summaryItem: {
		backgroundColor: '#f5f5f5',
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
	},
	summaryText: {
		fontSize: 16,
		color: '#333',
	},
})
