import Dispenser from '@/app/components/Dispenser'
import Header from '@/app/components/Header'
import { Link } from 'expo-router'
import React from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

// const Header = () => (
// 	<View style={styles.header}>
// 		<Image
// 			source={require('../../../../assets/icon.png')} // Replace with your logo
// 			style={styles.logo}
// 		/>
// 		<View style={styles.headerIcons}>
// 			<TouchableOpacity style={styles.iconButton}>
// 				<Image source={require('../../../../assets/icon.png')} style={styles.icon} />
// 			</TouchableOpacity>
// 			<TouchableOpacity style={styles.iconButton}>
// 				<Image source={require('../../../../assets/icon.png')} style={styles.icon} />
// 			</TouchableOpacity>
// 			<TouchableOpacity style={styles.iconButton}>
// 				<Image source={require('../../../../assets/icon.png')} style={styles.icon} />
// 			</TouchableOpacity>
// 			<TouchableOpacity style={styles.iconButton}>
// 				<Image source={require('../../../../assets/icon.png')} style={styles.icon} />
// 			</TouchableOpacity>
// 		</View>
// 	</View>
// )

const DispenserCard = ({ title, description, iconSource }) => (
	<View style={styles.card}>
		<Link href="/(tabs)/voucher.tsx">
			<View style={styles.cardContent}>
				<View style={styles.cardIconContainer}>
					<Image source={iconSource} style={styles.cardIcon} />
				</View>
				<View style={styles.cardTextContainer}>
					<Text style={styles.cardTitle}>{title}</Text>
					<Text style={styles.cardDescription}>{description}</Text>
				</View>
			</View>
		</Link>
	</View>
)

export default function DispenserScreen() {
	const dispensers = [
		{
			id: 1,
			title: 'Dispenser A1',
			description: 'Status: Available',
			iconSource: require('../../../../assets/icon.png'),
		},
		{
			id: 2,
			title: 'Dispenser A2',
			description: 'Status: In Use',
			iconSource: require('../../../../assets/icon.png'),
		},
		{
			id: 3,
			title: 'Dispenser B1',
			description: 'Status: Available',
			iconSource: require('../../../../assets/icon.png'),
		},
		{
      
			id: 4,
			title: 'Dispenser B2',
			description: 'Status: Maintenance',
			iconSource: require('../../../../assets/icon.png'),
		},
	]

	return (
		<SafeAreaView style={styles.container}>
			<Header />
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.grid}>
					{dispensers.map((dispenser) => (
						<Dispenser
							key={dispenser.id}
							title={dispenser.title}
							description={dispenser.description}
							iconSource={dispenser.iconSource}
						/>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
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
		paddingTop: 15,
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
