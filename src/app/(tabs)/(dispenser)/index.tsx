import Dispenser from '@/app/components/Dispenser'
import { DevControl, Token } from '@/store/library'
import { Redirect } from 'expo-router'
import React, { useEffect } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

export default function DispenserScreen() {
	const { setToken, items: token } = Token()
	const { getDev, dev } = DevControl()

	const { alert } = DevControl()

	const [visible, setVisible] = React.useState(false)

	const onToggleSnackBar = () => setVisible(!visible)

	const onDismissSnackBar = () => setVisible(false)

	useEffect(() => {
		if (alert) {
			setVisible(true)
		} else {
			setVisible(false)
		}
	}, [alert])

	useEffect(() => {
		getDev(token)
	}, [token])

	// Check if the token is available, if not, redirect to the login screen
	if (!token) {
		return <Redirect href="/login" />
	}

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					{/* Vertical ScrollView for dispensers */}
					<View style={styles.grid}>
						{dev?.result?.map((dispenser: any) => (
							<Dispenser
								noz={dispenser?.nozzle_no}
								dis={dispenser?.dep_no}
								key={dispenser?._id}
								title={dispenser?.fuel_type}
								description={dispenser?.description}
								iconSource={dispenser?.iconSource}
								price={dispenser?.daily_price}
								status={dispenser?.status}
							/>
						))}
					</View>
				</ScrollView>
				<Snackbar
					visible={visible}
					onDismiss={onDismissSnackBar}
					style={tw`ml-auto mb-10 mr-14 w-[320px]  bg-green-300 `}
					// action={{
					// 	label: 'Undo',
					// 	textColor: 'black',
					// 	onPress: () => {
					// 		// Do something
					// 	},
					// }}
				>
					<Text style={tw`text-2xl text-gray-800 `}>Process Success !</Text>
				</Snackbar>
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
	scrollContent: {
		padding: 16,
	},
	grid: {
		flexDirection: 'row', // Stack items vertically
		paddingStart: 16,
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: '100%', // Full width for each item, can be adjusted if needed
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
		marginBottom: 16, // Spacing between items
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
