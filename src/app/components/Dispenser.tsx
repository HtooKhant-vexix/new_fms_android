import { colors } from '@/constants/tokens'
import { Buffer } from 'buffer'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SerialPortAPI, { SerialPort } from 'react-native-serial-port-api'
import tw from 'twrnc'

const Dispenser = ({ price, addr, click, noz, dis, title, description, saleLiter, totalPrice }) => {
	// const serialPort = openSerialPort()
	const nozAddr = addr.find((e: { number: any }) => e.number === noz)?.address

	const [liveData, setLiveData] = useState(0.0)
	const [tPrice, setTPrice] = useState(0)
	const isListeningRef = useRef(false) // Use `useRef` instead of `useState`

	let serialPort: SerialPort

	const calculateCRC = (bytes: Buffer<ArrayBuffer>) => {
		let crc = 0xffff
		for (let byte of bytes) {
			crc = crc16Update(crc, byte)
		}
		return Buffer.from([crc & 0xff, (crc >> 8) & 0xff])
	}

	const crc16Update = (crc: number, a: number) => {
		crc ^= a
		for (let i = 0; i < 8; ++i) {
			crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1
		}
		return crc & 0xffff
	}

	// ✅ Open Serial Port
	const openSerialPort = async (portName = '/dev/ttyS8', baudRate = 9600) => {
		try {
			serialPort = await SerialPortAPI.open(portName, { baudRate })
			// console.log('✅ Serial port opened successfully')

			serialPort.onReceived(() => {
				// console.log('📩 Received data:', buff.toString('hex'))
			})

			return true
		} catch (error) {
			console.error('❌ Error opening serial port:', error)
			return false
		}
	}

	const readMultipleRegisters = async (startRegister: number, numRegisters: number, sId = 1) => {
		const isOpen = await openSerialPort()
		// console.log('✅ Reading multiple registers...')
		try {
			if (!isOpen) {
				console.warn('⚠️ Serial port is not open')
				return null
			}
			// Build request packet
			const slaveId = sId
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
				serialPort.onReceived((data: Uint8Array<ArrayBufferLike>) => {
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
	const parseResponse = (
		response: string | any[] | Buffer<ArrayBuffer>,
		slaveId: number,
		functionCode: number,
		numRegisters: number,
	) => {
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

		// console.log('CRC Valid:', receivedCRC === calculatedCRC)

		return registers
	}

	useEffect(() => {
		return () => stopListening()
	}, [])

	const stopListening = () => {
		isListeningRef.current = false // Update ref to stop loop
	}

	return (
		<View style={styles.card}>
			<TouchableOpacity
				onPress={() => {
					click()
					// router.push('/(tabs)/(dispenser)/auth'),
					// 	router.setParams({
					// 		noz: noz,
					// 		dis: dis,
					// 		price: price,
					// 		fuel: title,
					// 	})
				}}
				style={styles.cardContent}
			>
				<View style={tw`-mt-2`}>
					<View style={tw`flex flex-row gap-6 items-center justify-between pl-1`}>
						<Text style={tw`text-[34px] rounded-md mt-1 font-500 text-[${colors.primary}]`}>
							Nozzle - {noz}
						</Text>
						<Text style={styles.cardDescription}>SALE LITER :</Text>
					</View>
					<View style={tw`flex rounded-lg flex-row gap-2 items-center`}>
						<Text style={styles.liveData}>{saleLiter?.toFixed(3)}</Text>
					</View>
				</View>
				<View style={tw`mt-[-15px]`}>
					<Text style={styles.cardDescription}>TOTAL PRICE :</Text>
					<View style={tw`flex rounded-lg flex-row gap-2 items-center`}>
						<Text style={styles.liveData}>{totalPrice}</Text>
					</View>
				</View>
				<View style={tw`mt-[-15px]`}>
					<Text style={styles.cardDescription}>SALE PRICE :</Text>
					<View style={tw`flex rounded-lg flex-row gap-2 items-center`}>
						<Text style={styles.liveData}>{price}</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		width: 550,
		// backgroundColor: '#000',
		// borderRadius: 12,
		// marginHorizontal: 3,
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 2 },
		marginTop: -8,
		// shadowOpacity: 0.1,
		// shadowRadius: 4,
		// elevation: 10,
	},
	cardContent: {
		padding: 10,
		// backgroundColor: '#000000',
		// borderBlockColor: '#fafafa',
		borderWidth: 2,
		borderColor: colors.primary,
		borderRadius: 6,
		paddingVertical: 14,
		gap: 20,
	},
	liveData: {
		fontSize: 136,
		fontWeight: '600',
		lineHeight: 132,
		verticalAlign: 'middle',
		marginStart: 'auto',
		marginBottom: -28,
		paddingVertical: 8,
		textAlign: 'right',
		color: 'black',
	},
	cardDescription: {
		fontSize: 34,
		marginBottom: 4,
		marginRight: 18,
		textAlign: 'right',
		color: colors.primary,
	},
})

export default Dispenser
// import { openSerialPort, readMultipleRegisters } from '@/command/controlDispenser'
// import { colors } from '@/constants/tokens'
// import React, { useState } from 'react'
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import tw from 'twrnc'
// const Dispenser = ({ title, description, iconSource, price, status, noz, dis, addr }) => {
// 	// useEffect(() => {
// 	// 	// readMultipleRegisters(700, 40)
// 	// 	listenForDispenserData()

// 	// 	return () => stopListening() // Cleanup when unmounting
// 	// }, [])

// 	const serialPort = openSerialPort()
// 	const nozAddr = addr.filter((e) => e.number == noz)[0].address

// 	function changeNumber(num, increment) {
// 		return num + increment
// 	}
// 	// console.log(nozAddr, 'gggg', changeNumber(Number(nozAddr),8))

// 	const [liveData, setLiveData] = React.useState(999.0)
// 	const [tPrice, setTPrice] = useState(999999)

// 	let isListening = false
// 	const read = async () => {
// 		isListening = true
// 		console.log('Helos', nozAddr)
// 		try {
// 			// const data = await serialPort.read()
// 			// const data = await readMultipleRegisters(704, 2)
// 			// console.log('Data read from serial port:', data)
// 			// const floatValue = convertFloat(data[0], data[1])
// 			// console.log('Converted Float:', floatValue?.toFixed(2))
// 			//changeNumber(Number(nozAddr), 8)
// 			console.log(isListening)
// 			while (isListening) {
// 				console.log('Helos', nozAddr)
// 				console.log('1')
// 				try {
// 					const data = await readMultipleRegisters(changeNumber(Number(nozAddr), 8), 1)
// 					console.log('Data read from serial port:', data[0], '...')
// 					setLiveData(data[0])
// 					setTPrice(data[0] * price)
// 					// console.log(data[0] * price, 'ggg')
// 				} catch (error) {
// 					console.error('❌ Error reading data:', error)
// 					// stopListening() // Stop on error
// 					break
// 				}
// 				// setTimeout(() => {
// 				//   isListening = false
// 				// }
// 				// , 3000)
// 			}
// 		} catch (error) {
// 			console.error('Failed to read data:', error)
// 		}
// 	}

// 	return (
// 		<View style={styles.card}>
// 			{/* <View
// 				style={tw`bg-white border-2 border-blue-300 shadow shadow-xl shadow-[#33b0f9] w-[300px] h-[10px] absolute flex-row  text-center z-20 h-full rounded-full`}
// 			>
// 				<View
// 					style={tw`text-3xl border p-2 mt-1 rounded-full w-16 h-16 mx-auto flex items-center justify-center flex-row font-semibold`}
// 				>
// 					<Text style={tw`text-3xl font-semibold`}>{noz}</Text>
// 				</View>
// 				<Image
// 					source={require('../../../assets/gas-fuel.png')} // Replace with your logo
// 					style={tw`w-12 h-12 mb-6`}
// 				/>
// 			</View> */}
// 			<TouchableOpacity
// 				onPress={() => {
// 					// router.push('/(tabs)/(dispenser)/auth'),
// 					// 	router.setParams({
// 					// 		noz: noz,
// 					// 		dis: dis,
// 					// 		price: price,
// 					// 		fuel: title,
// 					// 	})
// 					console.log('Helos', nozAddr)
// 					read()
// 					// setTimeout(() => {
// 					// 	isListening = false
// 					// }, 10000)
// 				}}
// 				style={styles.cardContent}
// 			>
// 				{/* <View style={styles.cardIconContainer}>
// 					<Image source={iconSource} style={styles.cardIcon} />
// 				</View>
// 				<View style={styles.cardTextContainer}>
// 					<Text style={styles.cardTitle}>{title}</Text>
// 					<Text style={styles.cardDescription}>{description}</Text>
// 				</View> */}
// 				{/* <View style={tw`flex flex-row gap-6 items-center justify-center `}> */}
// 				{/* <Image
// 						source={require('../../../assets/gas-fuel.png')} // Replace with your logo
// 						style={tw`w-12 h-12`}
// 					/> */}
// 				{/* <View
// 						style={tw`text-3xl border p-2 mt-1 rounded-full w-16 h-16 mx-auto flex items-center justify-center flex-row font-semibold`}
// 					>
// 						<Text style={tw`text-3xl font-semibold`}>{noz}</Text>
// 					</View> */}
// 				{/* <Text style={styles.cardTitle}>{title}</Text> */}
// 				{/* </View> */}
// 				<View style={tw`-mt-4`}>
// 					<View style={tw`flex flex-row gap-6 items-center justify-between pl-1 pr-4`}>
// 						<Text style={tw`text-[34px] text-orange-600 bg-black px-3 rounded-md mt-1`}>
// 							Nozzle - {noz}
// 						</Text>
// 						<Text style={tw`text-[34px] mb-1 mt-2 text-white`}>SALE LITER :</Text>
// 					</View>
// 					<View style={tw`flex rounded-lg flex-row gap-2 items-center`}>
// 						<Text style={styles.liveData}>{liveData?.toFixed(3)}</Text>
// 					</View>
// 				</View>
// 				<View style={tw`mt-[-15px]`}>
// 					<Text style={styles.cardDescription}>TOTAL PRICE :</Text>
// 					<View style={tw`flex rounded-lg flex-row gap-2 items-center`}>
// 						<Text style={styles.liveData}>{tPrice}</Text>
// 					</View>
// 				</View>
// 				<View style={tw`mt-[-15px]`}>
// 					<Text style={styles.cardDescription}>SALE PRICE :</Text>
// 					<View style={tw`flex rounded-lg flex-row gap-2 items-center`}>
// 						<Text style={styles.liveData}>
// 							{price}
// 							{/* {price?.toLocaleString(undefined, {
// 								maximumFractionDigits: 3,
// 							})} */}
// 						</Text>
// 					</View>
// 				</View>

// 				{/* <View style={tw` flex flex-row gap-2 items-center`}> */}
// 				{/* .toLocaleString(undefined, {
//                 maximumFractionDigits: 3,
//               }) */}
// 				{/* <Text style={tw` text-[50px] font-bold mb-2  text-[#33b0f9]`}>
// 					{price?.toLocaleString(undefined, {
// 						maximumFractionDigits: 3,
// 					})}
// 				</Text> */}
// 				{/* <Text style={tw` text-3xl`}> MMK</Text> */}
// 				{/* </View> */}
// 				{/* <View>
// 				<Text style={tw` text-2xl`}>
// 					<Text style={tw`font-semibold`}>Status: </Text>
// 					{status}
// 				</Text>
// 			</View> */}
// 			</TouchableOpacity>
// 		</View>
// 	)
// }

// const styles = StyleSheet.create({
// 	card: {
// 		width: 540,
// 		backgroundColor: '#ffffff',
// 		borderRadius: 12,
// 		marginHorizontal: 2,
// 		shadowColor: '#000',
// 		shadowOffset: {
// 			width: 0,
// 			height: 2,
// 		},
// 		marginTop: -10,
// 		shadowOpacity: 0.1,
// 		shadowRadius: 4,
// 		elevation: 10,
// 	},
// 	cardContent: {
// 		// paddingStart: 100,
// 		padding: 10,
// 		paddingVertical: 14,
// 		// marginTop: -15,
// 		// height: 540,
// 		// paddingRight: 20,
// 		// flexDirection: 'row',
// 		// alignItems: 'start',
// 		gap: 20,
// 	},
// 	cardIconContainer: {
// 		width: 48,
// 		height: 48,
// 		borderRadius: 24,
// 		backgroundColor: '#f0f0f0',
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 	},
// 	cardIcon: {
// 		width: 24,
// 		height: 24,
// 	},
// 	cardTextContainer: {
// 		flex: 1,
// 	},
// 	cardTitle: {
// 		fontSize: 30,
// 		fontWeight: '600',
// 		width: '80%',
// 		// marginBottom: 14,
// 		backgroundColor: colors.primary,
// 		display: 'flex',
// 	},
// 	liveData: {
// 		fontSize: 136,
// 		fontWeight: '600',
// 		// marginBottom: 4,
// 		// backgroundColor: colors.primary,
// 		lineHeight: 132,
// 		verticalAlign: 'middle',
// 		marginStart: 'auto',
// 		marginBottom: -28,
// 		paddingVertical: 8,
// 		paddingRight: 6,
// 		textAlign: 'right',
// 		color: colors.primary,
// 	},
// 	cardDescription: {
// 		fontSize: 34,
// 		marginBottom: 4,
// 		marginRight: 20,
// 		textAlign: 'right',
// 		color: colors.text,
// 	},
// })

// export default Dispenser
