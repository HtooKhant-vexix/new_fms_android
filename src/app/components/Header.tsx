import { Link } from 'expo-router'
import React from 'react'
import { IoHome } from 'react-icons/io5'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Header = () => (
	<View style={styles.header}>
		<Link href="/(tabs)/voucher.tsx">
			<Image
				source={require('../../../assets/icon.png')} // Replace with your logo
				style={styles.logo}
			/>
		</Link>
		<View style={styles.headerIcons}>
			<TouchableOpacity style={styles.iconButton}>
				<Link href="/(tabs)/(dispenser)">
					{/* <Image source={require('../../../assets/icon.png')} style={styles.icon} /> */}
					<IoHome />
					<Text>Dispenser</Text>
				</Link>
			</TouchableOpacity>
			<TouchableOpacity style={styles.iconButton}>
				<Image source={require('../../../assets/icon.png')} style={styles.icon} />
			</TouchableOpacity>
			<TouchableOpacity style={styles.iconButton}>
				<Image source={require('../../../assets/icon.png')} style={styles.icon} />
			</TouchableOpacity>
			<TouchableOpacity style={styles.iconButton}>
				<Image source={require('../../../assets/icon.png')} style={styles.icon} />
			</TouchableOpacity>
		</View>
	</View>
)

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
