import { Link } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import tw from 'twrnc'
const Dispenser = ({ title, description, iconSource }) => (
	<View style={styles.card}>
		<View
			style={tw`bg-red-300 w-[100px] absolute left-[-35px] text-center z-20 h-full rounded-full`}
		>
			<Text>dd</Text>
		</View>
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

const styles = StyleSheet.create({
	card: {
		width: '40%',
		height: 200,
		margin: 10,
		marginHorizontal: 28,
		marginStart: 40,
		backgroundColor: '#ffffff',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
	},
	cardContent: {
		paddingStart: 100,
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

export default Dispenser
