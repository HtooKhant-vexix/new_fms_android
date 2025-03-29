import { Buffer } from 'buffer'
import SerialPortAPI from 'react-native-serial-port-api'

let serialPort = null

// ✅ Open Serial Port
export const openSerialPort = async (portName = '/dev/ttyS8', baudRate = 9600) => {
	try {
		serialPort = await SerialPortAPI.open(portName, { baudRate })
		// console.log('✅ Serial port opened successfully')

		serialPort.onReceived((buff) => {
			// console.log('📩 Received data:', buff.toString('hex'))
		})

		return true
	} catch (error) {
		console.error('❌ Error opening serial port:', error)
		return false
	}
}

// ✅ Close Serial Port
export const closeSerialPort = async () => {
	if (serialPort) {
		await serialPort.close()
		serialPort = null
		console.log('🔌 Serial port closed')
	}
}

// ✅ CRC-16 Calculation
const crc16Update = (crc, a) => {
	crc ^= a
	for (let i = 0; i < 8; ++i) {
		crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1
	}
	return crc & 0xffff
}

const calculateCRC = (bytes) => {
	let crc = 0xffff
	for (let byte of bytes) {
		crc = crc16Update(crc, byte)
	}
	return Buffer.from([crc & 0xff, (crc >> 8) & 0xff])
}

// ✅ Convert Float to Two 16-bit Registers
const floatToRegisters = (floatValue) => {
	const buffer = new ArrayBuffer(4)
	const view = new DataView(buffer)
	view.setFloat32(0, floatValue, false) // Big-endian (default)
	const combined = view.getUint32(0)
	return [(combined >> 16) & 0xffff, combined & 0xffff]
}


// ✅ Convert Two 16-bit Registers to Float
export const convertFloat = (highReg, lowReg) => {
	let rawValue = (highReg << 16) | (lowReg & 0xffff)
	let buffer = new ArrayBuffer(4)
	let dataView = new DataView(buffer)
	dataView.setUint32(0, rawValue, false) // false = big-endian
	return dataView.getFloat32(0, false)
}

const highByte = (value) => (value >> 8) & 0xff
const lowByte = (value) => value & 0xff

// ✅ Function to Write Multiple Registers (32-bit float)
export const writeMultipleRegisters = async (startRegister, floatValue) => {
	try {
		if (!serialPort) {
			console.warn('⚠️ Serial port is not open')
			return false
		}

		const slaveId = 1
		const functionCode = 0x10
		const writeQty = 2
		const transmitBuffer = floatToRegisters(floatValue)

		let adu = [
			slaveId,
			functionCode,
			(startRegister >> 8) & 0xff,
			startRegister & 0xff,
			(writeQty >> 8) & 0xff,
			writeQty & 0xff,
			writeQty * 2,
		]

		for (let i = 0; i < writeQty; i++) {
			adu.push((transmitBuffer[i] >> 8) & 0xff, transmitBuffer[i] & 0xff)
		}

		const crc = calculateCRC(adu)
		const fullPacket = Buffer.concat([Buffer.from(adu), crc])

		await serialPort.send(fullPacket.toString('hex'))
		// console.log(
		// 	`📤 Sent Modbus command:`,
		// 	fullPacket
		// 		.toString('hex')
		// 		.match(/.{1,2}/g)
		// 		.join(' '),
		// )

		return true
	} catch (error) {
		console.error('❌ Failed to send data:', error)
		return false
	}
}

// ✅ Function to Write a Single Register
export const writeSingleRegister = async (register, value) => {
	try {
		if (!serialPort) {
			console.warn('⚠️ Serial port is not open')
			return false
		}

		const slaveId = 1
		const functionCode = 0x06
		const packet = Buffer.from([
			slaveId,
			functionCode,
			(register >> 8) & 0xff,
			register & 0xff,
			(value >> 8) & 0xff,
			value & 0xff,
		])

		const crc = calculateCRC(packet)
		const fullPacket = Buffer.concat([packet, crc])

		await serialPort.send(fullPacket.toString('hex'))
		console.log(
			'📤 Sent Modbus command:',
			fullPacket
				.toString('hex')
				.match(/.{1,2}/g)
				.join(' '),
		)

		return true
	} catch (error) {
		console.error('❌ Failed to send data:', error)
		return false
	}
}

// // ✅ Read Multiple Registers
// export const readMultipleRegisters = async (startRegister, numRegisters) => {
//     const isOpen = await openSerialPort();
//     if (!isOpen) return;

//     try {
//         const slaveId = 1;
//         const functionCode = 0x03;
//         const packet = Buffer.from([
//             slaveId,
//             functionCode,
//             highByte(startRegister),
//             lowByte(startRegister),
//             highByte(numRegisters),
//             lowByte(numRegisters),
//         ]);

//         const crc = calculateCRC(packet);
//         const fullPacket = Buffer.concat([packet, crc]);

//         await serialPort.send(fullPacket.toString('hex'));
//         console.log('📤 Sent request (hex):', fullPacket.toString('hex').match(/.{1,2}/g).join(' '));

//         let response = Buffer.alloc(0);
//         serialPort.onReceived((data) => {
//             response = Buffer.concat([response, data]);
//             if (response.length >= 3 + numRegisters * 2 + 2) {
//                 parseResponse(response, slaveId, functionCode, numRegisters, startRegister);
// 				console.log('wkwkwkwk')
//             }
//         });
//     } catch (error) {
//         console.error('❌ Error reading registers:', error);
//     }
// };

// // ✅ Parse Response
// const parseResponse = (response, slaveId, functionCode, numRegisters, startRegister) => {
// 	if (response[0] !== slaveId || response[1] !== functionCode) {
// 		console.error('Invalid response:', response.toString('hex'))
// 		return
// 	}

// 	const byteCount = response[2]
// 	if (byteCount !== numRegisters * 2) {
// 		console.error(`Expected ${numRegisters * 2} bytes, got ${byteCount}`)
// 		return
// 	}

// 	const data = response.slice(3, 3 + byteCount)
// 	const registers = []
// 	for (let i = 0; i < byteCount; i += 2) {
// 		registers.push((data[i] << 8) | data[i + 1])
// 	}

// 	console.log(`✅ Read ${registers.length} registers from ${startRegister}:`, registers)

// 	const receivedCRC = (response[response.length - 1] << 8) | response[response.length - 2]
// 	const calculatedCRC = calculateCRC(response.slice(0, -2))
// 	console.log('CRC Valid:', receivedCRC === calculatedCRC)
// }

export const readMultipleRegisters = async (startRegister, numRegisters) => {
	const isOpen = await openSerialPort()
	// console.log('✅ Reading multiple registers...')
	try {
		if (!isOpen) {
			console.warn('⚠️ Serial port is not open')
			return null
		}
		// Build request packet
		const slaveId = 1
		const functionCode = 0x03
		const packet = Buffer.from([
			slaveId,
			functionCode,
			(startRegister >> 8) & 0xff,
			startRegister & 0xff,
			(numRegisters >> 8) & 0xff,
			numRegisters & 0xff,
		])

		const crc = calculateCRC(packet)
		const fullPacket = Buffer.concat([packet, crc])

		// Send request
		await serialPort.send(fullPacket.toString('hex'))
		// console.log(
		// 	'📤 Sent request (hex):',
		// 	fullPacket
		// 		.toString('hex')
		// 		.match(/.{1,2}/g)
		// 		.join(' '),
		// )

		// Read response
		return new Promise((resolve) => {
			let response = Buffer.alloc(0)
			serialPort.onReceived((data) => {
				response = Buffer.concat([response, data])
				// Check if we have enough bytes for the expected response
				if (response.length >= 3 + numRegisters * 2 + 2) {
					resolve(parseResponse(response, slaveId, functionCode, numRegisters, startRegister))
				}
			})
		})
	} catch (error) {
		console.error('❌ Error with SerialPort:', error)
		return null
	}
}

// ✅ Parse Response
const parseResponse = (response, slaveId, functionCode, numRegisters, startRegister) => {
	if (response[0] !== slaveId || response[1] !== functionCode) {
		console.error('Invalid response:', response.toString('hex'))
		return
	}

	const byteCount = response[2]
	if (byteCount !== numRegisters * 2) {
		console.error(`Expected ${numRegisters * 2} bytes, got ${byteCount}`)
		return
	}

	const data = response.slice(3, 3 + byteCount)
	const registers = []
	for (let i = 0; i < byteCount; i += 2) {
		registers.push((data[i] << 8) | data[i + 1])
	}

	// console.log(`✅ Read ${registers.length} registers from ${startRegister}:`, registers)

	const receivedCRC = (response[response.length - 1] << 8) | response[response.length - 2]
	const calculatedCRC = calculateCRC(response.slice(0, -2))
	// console.log('CRC Valid:', receivedCRC === calculatedCRC)

	return registers
}
