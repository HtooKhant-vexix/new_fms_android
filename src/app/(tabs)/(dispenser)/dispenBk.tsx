import Dispenser from '@/app/components/Dispenser'
import { getToken } from '@/constants/tokens'
import { Token } from '@/store/library'
import React, { useEffect } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import backImg from '../../../../assets/bg.png'

export default function DispenserScreen() {
	const { setToken, items } = Token()

	const dispensers = [
		{
			id: 1,
			title: 'Premium Diesel',
			description: 'Status: Available',
			iconSource: require('../../../../assets/icon.png'),
			price: 4500,
			status: 'normal',
		},
		{
			id: 2,
			title: 'Premium Diesel',
			description: 'Status: In Use',
			iconSource: require('../../../../assets/icon.png'),
			price: 4500,
			status: 'normal',
		},
		{
			id: 3,
			title: 'Diesel',
			description: 'Status: Available',
			iconSource: require('../../../../assets/icon.png'),
			price: 4500,
			status: 'normal',
		},
		{
			id: 4,
			title: 'Octane Ron (92)',
			description: 'Status: Maintenance',
			iconSource: require('../../../../assets/icon.png'),
			price: 4500,
			status: 'normal',
		},
	]

	const first = dispensers.map((dispenser) => (
		<Dispenser
			key={dispenser?.id}
			title={dispenser?.title}
			description={dispenser?.description}
			iconSource={dispenser?.iconSource}
			price={dispenser?.price}
			status={dispenser?.status}
		/>
	))

	useEffect(() => {
		const test = getToken()
		console.log(test, 'this is test')
	}, [])

	console.log(items, 'this is token')

	// console.warn(token, 'this is token')

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.grid}>
						{dispensers.map((dispenser) => (
							<Dispenser
								key={dispenser?.id}
								title={dispenser?.title}
								description={dispenser?.description}
								iconSource={dispenser?.iconSource}
								price={dispenser?.price}
								status={dispenser?.status}
							/>
						))}
					</View>
				</ScrollView>
			</ImageBackground>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	image: {
		flex: 1,
		justifyContent: 'center',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	logo: {
		width: 120,
		height: 40,
		resizeMode: 'contain',
	},
	headerIcons: {
		flexDirection: 'row',
		gap: 16,
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
		paddingStart: 16,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 35,
		width: 1105,
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
