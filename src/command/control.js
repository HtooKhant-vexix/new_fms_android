import { router } from "expo-router"
import { closeSerialPort, openSerialPort, writeMultipleRegisters, writeSingleRegister } from "./controlDispenser"


export const presetCommand = async (value) => {
	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
	const isOpen = await openSerialPort()
	if (isOpen) {
		console.log('✅ Writing single register...')
		await writeSingleRegister(734, 1)

		await delay(100) // Add a delay of 100ms

		console.log('✅ Writing multiple registers...')
		await writeMultipleRegisters(724, value)

		await closeSerialPort()
		router.push('/(tabs)/(dispenser)')
	}
}

export const permitCommand = async () => {
	const isOpen = await openSerialPort()
	if (isOpen) {
		await writeSingleRegister(734, 1) // Example: Write value 3000 to register 728
		await closeSerialPort()
		router.push('/(tabs)/(dispenser)')
		console.log('clicked')
	}
}

// let isListening = false // Control flag

// export const listenForDispenserData = async () => {
// 	const isOpen = await openSerialPort()

// 	if (isOpen) {
// 		console.log('✅ Listening for dispenser data...')
// 		isListening = true // Start listening

// 		while (isListening) {
// 			try {
// 				const data = await readMultipleRegisters(700,40) // Read data from serial port

// 				if (data) {
// 					console.log('🔹 Received Data:', data)

// 					// Example: Navigate if specific data is received
// 					if (data.includes('COMPLETE')) {
// 						console.log('✅ Dispensing complete. Navigating...')
// 						await closeSerialPort()
// 						router.push('/(tabs)/(dispenser)')
// 						stopListening() // Stop listening after navigation
// 						break // Exit loop
// 					}
// 				}
// 			} catch (error) {
// 				console.error('❌ Error reading data:', error)
// 				stopListening() // Stop on error
// 				break
// 			}
// 		}
// 	}
// }

// // Function to stop listening
// export const stopListening = async () => {
// 	isListening = false
// 	await closeSerialPort()
// 	console.log('🛑 Listening stopped.')
// }
