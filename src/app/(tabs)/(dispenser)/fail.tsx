import * as Location from 'expo-location'
import { router, useGlobalSearchParams, useLocalSearchParams, usePathname } from 'expo-router'
import React, { useState } from 'react'
import {
	Image,
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

const fail = () => {
	const glob = useGlobalSearchParams()
	const local = useLocalSearchParams()

	const test = usePathname()

	const [receivedData, setReceivedData] = useState('')
	const [location, setLocation] = useState<Location.LocationObject | null>(null)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	// console.log(receivedData, 'this is data', location)

	return (
		<>
			<SafeAreaView style={styles.container}>
				<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
					<View style={styles.card}>
						{/* <Text style={styles.title}>Authentication for nozzle 02</Text> */}
						<View style={styles.contentContainer}>
							<Image source={require('../../../../assets/rfid.png')} style={styles.image1} />
							<View style={styles.textContainer}>
								<View style={tw`mt-3`}>
									<Text style={tw`text-[25px] text-slate-700 ml-2 mb-3`}>
										Authentication for nozzle {glob?.nozzle}
									</Text>
									<Text style={tw`text-[36px] font-semibold text-red-400`}>
										Card is not valid To Unlock The Dispenser
									</Text>
									<Text style={tw`text-[30px]`}></Text>
								</View>
								<TouchableOpacity
									onPress={() => router.push('/(tabs)/(dispenser)')}
									style={styles.button}
								>
									<Text style={styles.buttonText}>Back to Home</Text>
								</TouchableOpacity>
							</View>
							{/* <Text>Received Data: {receivedData}</Text>
							<SerialPortComponent
								portName="/dev/ttyS8"
								baudRate={38400}
								onDataReceived={handleDataReceived}
							/> */}
						</View>
					</View>
				</ImageBackground>
			</SafeAreaView>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		// margin: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		marginTop: -30,
		marginHorizontal: 'auto',
		width: 800,
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	image: {
		flex: 1,
		justifyContent: 'center',
	},
	title: {
		fontSize: 24,
		marginStart: 15,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	contentContainer: {
		flexDirection: 'row',
		gap: 16,
	},
	image1: {
		width: 280,
		height: 280,
		borderRadius: 8,
	},
	textContainer: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: 10,
	},
	paragraph: {
		fontSize: 16,
		lineHeight: 24,
		color: '#666',
	},
	button: {
		backgroundColor: '#007AFF',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 16,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})

export default fail
