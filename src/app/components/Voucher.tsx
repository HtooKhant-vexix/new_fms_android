import { colors } from '@/constants/tokens'
import { Ionicons } from '@expo/vector-icons'
import React, { memo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
interface VoucherProps {
	onClick: (data: any) => void
	data: {
		vocono: string
		saleLiter: number
		salePrice: number
		totalPrice: number
		fuelType: string
		dailyReportDate: string
		createAt?: string
	}
}

const Voucher = memo(({ onClick, data }: VoucherProps) => {
	return (
		<View style={tw`border border-[${colors.primary}] bg-white rounded-lg py-4 px-10`}>
			<View style={tw`flex flex-row justify-between`}>
				<View style={tw`flex  w-[90%] justify-between`}>
					<View style={tw`flex flex-row  items-center justify-between`}>
						<Text style={tw`text-2xl`}>{data?.vocono}</Text>
						<Text style={tw`text-2xl`}>
							{data?.saleLiter}liter x {data?.salePrice} mmk
						</Text>
						<Text style={tw`text-2xl`}>{data?.totalPrice} mmk</Text>
					</View>
					<View style={tw`flex flex-row items-center justify-between`}>
						<Text style={tw`text-2xl`}>{data?.fuelType}</Text>
						<Text style={tw`text-2xl`}>
							{data?.dailyReportDate} 23:33 {data?.createAt?.slice(11, 19)}
						</Text>
					</View>
				</View>
				<TouchableOpacity
					onPress={() => onClick(data)}
					style={tw`flex flex-row  items-center bg-[${colors.primary}] p-5 rounded-lg justify-center`}
				>
					<Ionicons name="print" size={32} style={tw`flex text-white`} />
				</TouchableOpacity>
			</View>
		</View>
	)
})

export default Voucher
