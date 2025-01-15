// import { useEffect, useRef } from 'react'
// import SerialPortAPI from 'react-native-serial-port-api'

// /**
//  * Hook to open, send data to, and read from a serial port.
//  *
//  * @param {string} portName - The port name (e.g., '/dev/ttyS4')
//  * @param {number} baudRate - The baud rate for the serial connection (default 38400)
//  * @param {function} onDataReceived - Callback function that gets called when data is received
//  * @returns {function} sendData - Function to send data to the serial port
//  */
// const useSerialPort = (portName, baudRate = 9600, onDataReceived, type) => {
// 	const serialPortRef = useRef(null)

// 	useEffect(() => {
// 		let serialPort // Declare serialPort inside useEffect to ensure it's scoped correctly.

// 		const openPort = async () => {
// 			try {
// 				// Open the serial port connection
// 				serialPort = await SerialPortAPI.open(portName, { baudRate })
// 				serialPortRef.current = serialPort

// 				// Subscribe to data received
// 				const sub = serialPort.onReceived((buff) => {
// 					const hexData = buff.toString(type)
// 					onDataReceived(hexData) // Call the callback with received data
// 				})

// 				// Return cleanup function to close the port and unsubscribe when component unmounts
// 				return () => {
// 					sub.remove() // Remove the subscription
// 					serialPort.close() // Close the serial port
// 				}
// 			} catch (error) {
// 				console.error('Failed to open serial port:', error)
// 			}
// 		}

// 		// Run openPort when component mounts
// 		openPort()

// 		// Cleanup function for useEffect
// 		return () => {
// 			if (serialPortRef.current) {
// 				serialPortRef.current.close()
// 				serialPort.close()
// 			}
// 		}
// 	}, [portName, baudRate, onDataReceived])

// 	// Function to send data to the serial port
// 	const sendData = async (data) => {
// 		if (serialPortRef.current && data) {
// 			try {
// 				await serialPortRef.current.send(data) // Send hex data
// 			} catch (error) {
// 				console.error('Failed to send data:', error)
// 			}
// 		} else {
// 			console.warn('Serial port is not open or data is missing.')
// 		}
// 	}

// 	return sendData
// }

// export default useSerialPort
