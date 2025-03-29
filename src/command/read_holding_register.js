import { NativeModules, NativeEventEmitter } from 'react-native'
import { Buffer } from 'buffer'

const { SerialPort } = NativeModules
const serialPortEmitter = new NativeEventEmitter(SerialPort)

// CRC-16 function from your C code
function crc16Update(crc, a) {
	crc ^= a
	for (let i = 0; i < 8; ++i) {
		if (crc & 1) {
			crc = (crc >> 1) ^ 0xa001
		} else {
			crc = crc >> 1
		}
	}
	return crc & 0xffff
}

function calculateCRC(bytes) {
	let crc = 0xffff
	for (let byte of bytes) {
		crc = crc16Update(crc, byte)
	}
	return crc
}

// Helper functions for byte manipulation
function highByte(value) {
	return (value >> 8) & 0xff
}

function lowByte(value) {
	return value & 0xff
}

export async function readMultipleRegisters(startRegister, numRegisters) {
	try {
		// Device path might be different on Android
		const devicePath = '/dev/ttyUSB0' // Adjust for your device

		// Open serial port
		await SerialPort.open(devicePath, 9600, 8, 'none', 1)
		console.log('Serial port opened')

		// Build request packet
		const slaveId = 1
		const functionCode = 0x03
		const packet = Buffer.from([
			slaveId,
			functionCode,
			highByte(startRegister),
			lowByte(startRegister),
			highByte(numRegisters),
			lowByte(numRegisters),
		])

		const crc = calculateCRC(packet)
		const fullPacket = Buffer.concat([packet, Buffer.from([lowByte(crc), highByte(crc)])])

		// Send request
		await SerialPort.write(fullPacket.toString('base64'))
		console.log(
			'Sent request (hex):',
			fullPacket
				.toString('hex')
				.match(/.{1,2}/g)
				.join(' '),
		)

		// Read response
		return new Promise((resolve, reject) => {
			let response = Buffer.alloc(0)
			const expectedLength = 3 + numRegisters * 2 + 2 // 85 for 40 registers
			let timeout

			const subscription = serialPortEmitter.addListener('onReadData', (data) => {
				const chunk = Buffer.from(data.data, 'base64')
				response = Buffer.concat([response, chunk])

				// Clear previous timeout
				if (timeout) clearTimeout(timeout)

				// Check if we have enough data
				if (response.length >= expectedLength) {
					subscription.remove()
					clearTimeout(timeout)
					parseResponse(response, startRegister, numRegisters, slaveId, functionCode)
						.then(resolve)
						.catch(reject)
						.finally(() => SerialPort.close())
				} else {
					// Set new timeout
					timeout = setTimeout(() => {
						subscription.remove()
						SerialPort.close()
						reject(new Error('Timeout waiting for response'))
					}, 2000) // 2 second timeout
				}
			})

			// Initial timeout in case no data comes at all
			timeout = setTimeout(() => {
				subscription.remove()
				SerialPort.close()
				reject(new Error('Timeout waiting for response'))
			}, 2000)
		})
	} catch (error) {
		console.error('Error with SerialPort:', error)
		await SerialPort.close()
		throw error
	}
}

async function parseResponse(response, startRegister, numRegisters, slaveId, functionCode) {
	if (response[0] === slaveId && response[1] === functionCode) {
		const byteCount = response[2]
		if (byteCount !== numRegisters * 2) {
			throw new Error(`Expected ${numRegisters * 2} bytes, got ${byteCount}`)
		}

		const data = response.slice(3, 3 + byteCount)
		const registers = []
		for (let i = 0; i < byteCount; i += 2) {
			registers.push((data[i] << 8) | data[i + 1])
		}

		console.log(`Read ${registers.length} registers from ${startRegister}:`)
		registers.forEach((val, idx) => {
			console.log(
				`Register ${startRegister + idx}: ${val} (0x${val.toString(16).padStart(4, '0')})`,
			)
		})

		// Verify CRC
		const receivedCRC = (response[response.length - 1] << 8) | response[response.length - 2]
		const calculatedCRC = calculateCRC(response.slice(0, -2))
		console.log('CRC Valid:', receivedCRC === calculatedCRC)

		return registers
	} else {
		console.error(
			'Invalid response:',
			response
				.toString('hex')
				.match(/.{1,2}/g)
				.join(' '),
		)
		throw new Error('Invalid Modbus response')
	}
}
