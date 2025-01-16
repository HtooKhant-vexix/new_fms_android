import Voucher from '@/app/components/Voucher'
import { Token, useStore } from '@/store/library'
import { utilsStyles } from '@/styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import SerialPortAPI from 'react-native-serial-port-api'
import tw from 'twrnc'

const Index = () => {
	let start = new Date()
	start.setHours(0)
	start.setMinutes(0)
	start.setSeconds(0)
	start = new Date(start)

	let end = new Date()
	end.setHours(23)
	end.setMinutes(59)
	end.setSeconds(59)
	end = new Date(end)

	const { items, isLoading, error, fetchItems } = useStore()
	const { items: token } = Token()

	const [name, setName] = React.useState('')
	const [address, setAddress] = React.useState('')
	const [city, setCity] = React.useState('')
	const [state, setState] = React.useState('')
	const [phoneOne, setPhone1] = React.useState('')
	const [phoneTwo, setPhone2] = React.useState('')

	useEffect(() => {
		try {
			const dataGet = async () => {
				const jsonValue = await AsyncStorage.getItem('info')
				console.log(JSON.parse(jsonValue), 'this is json value')

				const data = JSON.parse(jsonValue)

				if (jsonValue) {
					setName(data?.name)
					setAddress(data?.address)
					setCity(data?.city)
					setState(data?.state)
					setPhone1(data?.phone1)
					setPhone2(data?.phone2)
				} else {
					setName('')
					setAddress('')
					setCity('')
					setState('')
					setPhone1('')
					setPhone2('')
				}
			}
			dataGet()
		} catch (e) {
			console.log(e, 'this is error from useEffect')
		}
	}, [])

	const route = `detail-sale/pagi/by-date/1?sDate=${start}&eDate=${end}`

	useEffect(() => {
		fetchItems(route, token)
	}, [fetchItems, route, token])

	const [chg, setChg] = useState({ hex: '', text: '' })

	const ItemDivider = () => (
		<View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
	)

	const fuelInvoice = `
  1B40                              // Initialize printer
  1B6101                            // Center alignment
  4645454C204445504F540A            // "FUEL DEPOT" (centered)
  3120474F4F44535052494E47532052442C0A // "1 GOODSPRINGS RD,"
  4A45414E2C204E562038393031390A    // "JEAN, NV 89019"
  3730322D3736312D373030300A        // "702-761-7000"
  1B6100                            // Left alignment
  2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A    // Divider line (dashes)
  4441544520202020202030372F31302F323032300A // "DATE        07/10/2020"
  54494D45202020202031303A343020414D0A       // "TIME        10:40 AM"
  50554D5020202020202020380A                 // "PUMP        8"
  5452414E2320202020203137310A               // "TRAN#       171"
  2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A            // Divider line (dashes)
  44455441494C530A                          // "DETAILS"
  424153452050524943452020202420322E3937202F2047414C0A // "BASE PRICE   $2.97 / GAL"
  47414C4C4F4E532020202033332E313832300A               // "GALLONS      33.1820"
  544F54414C20202020202020242039382E35350A            // "TOTAL        $98.55"
  0A                                            // Line feed
  24582039382E353520524547204655454C0A              // "$98.55 REG FUEL"
  245820342E3433205441580A                           // "$4.43 TAX"
  24582D3130322E3938205649534120444542495420504149440A // "$-102.98 VISA DEBIT PAID"
  0A                                            // Line feed
  245820302E30302042414C414E43450A                    // "$0.00 BALANCE"
  0A                                            // Line feed
  1B6101                                      // Center alignment
  5448414E4B20594F5520464F52205649534954494E470A // "THANK YOU FOR VISITING"
  4645454C204445504F540A                      // "FUEL DEPOT"
  1B6402                                      // Feed 2 lines
  1D564100                                    // Cut paper
  `

	const hexToString = (hex) => {
		let str = ''
		for (let i = 0; i < hex.length; i += 2) {
			const charCode = parseInt(hex.substr(i, 2), 16)
			str += String.fromCharCode(charCode)
		}
		return str
	}

	const convertToHex = (str) => {
		let hex = ''
		for (let i = 0; i < str.length; i++) {
			hex += '' + str.charCodeAt(i).toString(16)
		}
		return hex
	}

	const sentBtn = async (data) => {
		try {
			const serialPort = await SerialPortAPI.open('/dev/ttyS5', {
				baudRate: 9600,
			})

			const stationName = convertToHex(name)
			const location = convertToHex(`${address}, ${city}, ${state}`)
			const phone1 = convertToHex(phoneOne)
			const phone2 = convertToHex(phoneTwo)
			const date = convertToHex(data?.dailyReportDate.toString())
			const time = convertToHex(data?.createAt.slice(11, 19).toString())
			const noz = convertToHex(data?.nozzleNo)
			const vocono = convertToHex(data?.vocono)
			const basePrice = convertToHex(data?.salePrice.toString())
			const liter = convertToHex(data?.saleLiter.toString())
			const total = convertToHex(data?.totalPrice.toString())
			const fuel = convertToHex(data?.fuelType)

			await serialPort.send(`1B401B6101${stationName}0A`)
			await serialPort.send(`${location}0A`)
			await serialPort.send(`${phone1}2C20${phone2}0A`)
			await serialPort.send('1B6100')
			await serialPort.send('2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A')
			await serialPort.send(`564F434F4E4F202020${vocono}0A`)
			await serialPort.send(`444154452020202020${date}0A`)
			await serialPort.send(`54494D452020202020${time}0A`)
			await serialPort.send(`4E4F5A5A4C45202020${noz}0A`)
			await serialPort.send('2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A')
			await serialPort.send(`4655454C20202020${fuel}0A`)
			await serialPort.send(`4241534520505249434520202020${basePrice}204D4D4B202F204C495445520A`)
			await serialPort.send(`53414C45204C4954455253202020${liter}204C490A`)
			await serialPort.send(`544F54414C202020202020202020${total}204D4D4B0A`)
			await serialPort.send(`202020202020202020202020202028494E434C555349564520544158290A`)
			await serialPort.send('2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A')
			await serialPort.send('1B6101')
			await serialPort.send('5448414E4B20594F5520464F52205649534954494E470A')
			await serialPort.send('1B6401')
			await serialPort.send('1D564100')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<View style={tw`px-6 py-2`}>
			<FlatList
				data={items?.result}
				contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
				ListFooterComponent={ItemDivider}
				ItemSeparatorComponent={ItemDivider}
				keyExtractor={(item, index) => `key-${index}`}
				renderItem={({ item: track }) => (
					<View>
						<Voucher onClick={() => sentBtn(track)} data={track} />
					</View>
				)}
			/>
		</View>
	)
}

export default Index
