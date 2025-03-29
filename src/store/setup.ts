import AsyncStorage from '@react-native-async-storage/async-storage'

// Update the interface to reflect the new data structure
export interface FuelDispenserConfig {
	nozzleCount: number
	nozzleConfigs: Array<{
		number: string
		address: string
	}>
}

// Save the configuration to AsyncStorage
export const saveConfig = async (config: FuelDispenserConfig): Promise<void> => {
	try {
		await AsyncStorage.setItem('fuelDispenserConfig', JSON.stringify(config))
	} catch (error) {
		console.error('Error saving config:', error)
		throw error
	}
}

// Load the configuration from AsyncStorage
export const loadConfig = async (): Promise<FuelDispenserConfig | null> => {
	try {
		const configString = await AsyncStorage.getItem('fuelDispenserConfig')
		console.log(configString, '..')
		if (configString) {
			return JSON.parse(configString) as FuelDispenserConfig
		}
		return null
	} catch (error) {
		console.error('Error loading config:', error)
		throw error
	}
}

// Clear the configuration from AsyncStorage
export const clearConfig = async (): Promise<void> => {
	try {
		await AsyncStorage.removeItem('fuelDispenserConfig')
	} catch (error) {
		console.error('Error clearing config:', error)
		throw error
	}
}
