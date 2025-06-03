import { colors } from '@/constants/tokens'
import { Token, useStore } from '@/store/library'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link, router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'

interface RouteItem {
	name: string
	icon: keyof typeof Ionicons.glyphMap
	route: string
}

const ROUTES: RouteItem[] = [
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

const Header: React.FC = () => {
	const { items, isLoading, error, fetchItems } = useStore()
	const { items: token } = Token()

	const dateRange = useMemo(() => {
		const start = new Date()
		start.setHours(0, 0, 0, 0)

		const end = new Date()
		end.setHours(23, 59, 59, 999)

		return { start, end }
	}, [])

	const route = useMemo(
		() => `detail-sale/pagi/by-date/1?sDate=${dateRange.start}&eDate=${dateRange.end}`,
		[dateRange],
	)

	const handleRoutePress = useCallback(
		(routeItem: RouteItem) => {
			router.push(routeItem.route)
			if (routeItem.name === 'Voucher') {
				fetchItems(route, token)
			}
		},
		[fetchItems, route, token],
	)

	const renderLogo = useCallback(
		() => (
			<Link href="/(tabs)/authen">
				<View style={tw`flex flex-row items-center gap-2`}>
					<Image
						source={require('../../../assets/six_logo.png')}
						style={styles.logo}
						accessibilityLabel="Sixth Kendra Logo"
					/>
					<Text style={tw`text-[45px] ml-[-30px] font-bold text-[${colors.primary}]`}>
						Sixth Kendra
					</Text>
				</View>
			</Link>
		),
		[],
	)

	const renderNavigationButtons = useCallback(
		() => (
			<View style={styles.headerIcons}>
				{ROUTES.map((routeItem) => (
					<TouchableOpacity
						key={routeItem.name}
						onPress={() => handleRoutePress(routeItem)}
						style={tw`bg-[${colors.primary}] px-6 flex flex-row justify-around items-center py-3 gap-2 rounded-md`}
						accessibilityRole="button"
						accessibilityLabel={`Navigate to ${routeItem.name}`}
					>
						<Ionicons name={routeItem.icon} size={32} style={tw`flex text-white`} />
						<View>
							<Text style={tw`text-white text-xl`}>{routeItem.name}</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		),
		[handleRoutePress],
	)

	return (
		<View style={styles.header}>
			{renderLogo()}
			{renderNavigationButtons()}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		// backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		height: 90,
		backgroundColor: '#ffffff',
	},
	logo: {
		width: 140,
		height: 55,
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
