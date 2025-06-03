import { colors } from '@/constants/tokens'
import { Buffer } from 'buffer'
import React, { memo, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SerialPortAPI, { SerialPort } from 'react-native-serial-port-api'
import tw from 'twrnc'

type DispenserProps = {
	price: number
	addr: { number: number; address: string }[]
	click: () => void
	noz: number
	dis: string
	title: string
	description: string
	saleLiter: number
	totalPrice: number
}

const Dispenser = memo(function Dispenser({
	price,
	addr,
	click,
	noz,
	dis,
	title,
	description,
	saleLiter,
	totalPrice,
}: DispenserProps) {
	const nozAddr = useMemo(
		() => addr.find((e: { number: any }) => e.number === noz)?.address,
		[addr, noz],
	)

	const [liveData, setLiveData] = useState(0.0)
	const [tPrice, setTPrice] = useState(0)
	const isListeningRef = useRef(false)

	let serialPort: SerialPort

	const calculateCRC = useMemo(() => {
		return (bytes: Buffer<ArrayBuffer>) => {
			let crc = 0xffff
			for (let byte of bytes) {
				crc = crc16Update(crc, byte)
			}
			return Buffer.from([crc & 0xff, (crc >> 8) & 0xff])
		}
	}, [])

	const crc16Update = useMemo(() => {
		return (crc: number, a: number) => {
			crc ^= a
			for (let i = 0; i < 8; ++i) {
				crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1
			}
			return crc & 0xffff
		}
	}, [])

	const openSerialPort = async (portName = '/dev/ttyS8', baudRate = 9600) => {
		try {
			serialPort = await SerialPortAPI.open(portName, { baudRate })
			serialPort.onReceived(() => {
				// Handle received data
			})
			return true
		} catch (error) {
			console.error('❌ Error opening serial port:', error)
			return false
		}
	}

	const readMultipleRegisters = async (startRegister: number, numRegisters: number, sId = 1) => {
		const isOpen = await openSerialPort()
		try {
			if (!isOpen) {
				console.warn('⚠️ Serial port is not open')
				return null
			}

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

			await serialPort.send(fullPacket.toString('hex'))

			return new Promise((resolve) => {
				let response = Buffer.alloc(0)
				serialPort.onReceived((data: Uint8Array<ArrayBufferLike>) => {
					response = Buffer.concat([response, data])
					if (response.length >= 3 + numRegisters * 2 + 2) {
						resolve(parseResponse(response, slaveId, functionCode, numRegisters))
					}
				})
			})
		} catch (error) {
			console.error('❌ Error with SerialPort:', error)
			return null
		}
	}

	const parseResponse = useMemo(() => {
		return (
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

			return registers
		}
	}, [])

	// useEffect(() => {
	// 	return () => stopListening()
	// }, [])

	const stopListening = () => {
		isListeningRef.current = false
	}

	const formattedSaleLiter = useMemo(() => saleLiter?.toFixed(3), [saleLiter])
	const formattedTotalPrice = useMemo(() => totalPrice, [totalPrice])
	const formattedPrice = useMemo(() => price, [price])

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
						<Text style={styles.liveData}>{formattedSaleLiter}</Text>
					</View>
				</View>
				<View style={tw`mt-[-15px]`}>
					<Text style={styles.cardDescription}>TOTAL PRICE :</Text>
					<View style={tw`flex rounded-lg flex-row gap-2 items-center`}>
						<Text style={styles.liveData}>{formattedTotalPrice}</Text>
					</View>
				</View>
				<View style={tw`mt-[-15px]`}>
					<Text style={styles.cardDescription}>SALE PRICE :</Text>
					<View style={tw`flex rounded-lg flex-row gap-2 items-center`}>
						<Text style={styles.liveData}>{formattedPrice}</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
})

const styles = StyleSheet.create({
	card: {
		width: 550,
		marginTop: -8,
	},
	cardContent: {
		padding: 10,
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
