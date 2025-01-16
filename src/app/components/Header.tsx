import { colors } from '@/constants/tokens'
import { Token, useStore } from '@/store/library'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link, router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'

const Route = [
	{
		name: 'Home',
		icon: 'home',
		route: '/(tabs)/(dispenser)',
	},
	{
		name: 'Voucher',
		icon: 'file-tray-full',
		route: '/(tabs)/voucher',
	},
	// {
	// 	name: 'Price Change',
	// 	icon: 'pricetags',
	// 	route: '/(tabs)/preset',
	// },
	{
		name: 'Setting',
		icon: 'settings',
		route: '/(tabs)/setting',
	},
]

const data = {
	nozzle: '01',
	dispenser: '1',
	voucher: '23/sdfsfsafsf/333',
}

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

const Header = () => {
	const { items, isLoading, error, fetchItems } = useStore()
	const { items: token } = Token()

	const route = `detail-sale/pagi/by-date/1?sDate=${start}&eDate=${end}`

	return (
		<View style={styles.header}>
			<Link href="/(tabs)/authen">
				<View style={tw`flex flex-row items-center gap-2`}>
					<Image
						source={require('../../../assets/six_logo.png')} // Replace with your logo
						style={styles.logo}
					/>
					<Text style={tw`text-[45px] ml-[-25px] mb-[-15px] font-bold text-[${colors.primary}]`}>
						Sixth Kendra
					</Text>
				</View>
			</Link>
			<View style={styles.headerIcons}>
				{Route.map((e) => (
					<TouchableOpacity
						key={e.name}
						onPress={() => {
							router.push(e?.route)
							if (e.name === 'Voucher') {
								fetchItems(route, token)
							}
						}}
						style={tw`bg-[${colors.primary}] px-6 flex flex-row justify-around items-center py-3 gap-2 rounded-md`}
					>
						<Ionicons name={e?.icon} size={32} style={tw`flex text-white`} />
						<View>
							<Text style={tw`text-white text-xl`}>{e?.name}</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		height: 110,
	},
	logo: {
		width: 140,
		height: 70,
		// backgroundColor: 'red',
		resizeMode: 'contain',
	},
	headerIcons: {
		flexDirection: 'row',
		gap: 20,
		paddingEnd: 20,
	},
	iconButton: {
		padding: 8,
	},
	icon: {
		width: 24,
		height: 24,
	},
	scrollContent: {
		padding: 16,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
	},
	card: {
		width: '48%',
		backgroundColor: '#ffffff',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cardContent: {
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	cardIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardIcon: {
		width: 24,
		height: 24,
	},
	cardTextContainer: {
		flex: 1,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	cardDescription: {
		fontSize: 14,
		color: '#666666',
	},
})

export default Header
