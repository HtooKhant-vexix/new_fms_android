import Dispenser from '@/app/components/Dispenser'
import SetupWizard from '@/app/components/Setup'
import { DevControl, nozConfig, Token } from '@/store/library'
import { Redirect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'
import { clearConfig } from '@/store/setup'

export default function DispenserScreen() {
	const { setToken, items: token, isRefresh } = Token()
	const { items: configNoz } = nozConfig()
	const { getDev, dev, alert } = DevControl()

	const [visible, setVisible] = useState(false)
	const [dispensers, setDispensers] = useState([])
	const [config, setConfig] = useState(null)
	const [loadingConfig, setLoadingConfig] = useState(true)

	const filData =
		configNoz &&
		JSON.parse(configNoz)?.nozzleConfigs?.map((nozzle) => nozzle?.number.padStart(2, '0'))
	console.log(dispensers.filter((dispenser) => filData?.includes(dispenser?.nozzle_no)))
	console.log(filData)
	const nozData = dispensers.filter((dispenser) => filData?.includes(dispenser?.nozzle_no))
	console.log(configNoz && JSON.parse(configNoz)?.nozzleConfigs, 'hhhh')
  

	// Show Snackbar if alert is triggered
	useEffect(() => {
		setVisible(!!alert)
	}, [alert])

	// Fetch dispensers if token is available
	useEffect(() => {
		if (token) {
			getDev(token)
		}
	}, [token])

	// Update dispensers when dev data is received
	useEffect(() => {
		if (dev?.result) {
			setDispensers(dev.result)
		}
	}, [dev])

	// Load configuration from AsyncStorage
	// useEffect(() => {
	// 	const loadConfig = async () => {
	// 		try {
	// 			const configString = await AsyncStorage.getItem('fuelDispenserConfig')
	// 			setConfig(configString ? configString : null)
	// 		} catch (error) {
	// 			console.error('Error loading config:', error)
	// 		} finally {
	// 			setLoadingConfig(false)
	// 		}
	// 	}
	// 	loadConfig()
	// 	// clearConfig()
	// }, [])
  // clearConfig()

	// Redirect to login if token is missing
	if (!token) {
		return <Redirect href="/login" />
	}

	// Redirect to setup if config is missing
	// if (!loadingConfig && !config) {
	// 	return <Redirect href="/(tabs)/setup" />
	// }

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				{configNoz ? (
					<ScrollView contentContainerStyle={styles.scrollContent}>
						{/* Grid for dispensers */}
						<View style={styles.grid}>
							{nozData.map((dispenser) => (
								<Dispenser
									key={dispenser?._id}
									noz={dispenser?.nozzle_no}
									dis={dispenser?.dep_no}
									title={dispenser?.fuel_type}
									description={dispenser?.description}
									iconSource={dispenser?.iconSource}
									price={dispenser?.daily_price}
									status={dispenser?.status}
									addr={configNoz && JSON.parse(configNoz)?.nozzleConfigs}
								/>
							))}
						</View>
					</ScrollView>
				) : (
					<SetupWizard />
				)}

				<Snackbar
					visible={visible}
					onDismiss={() => setVisible(false)}
					style={tw`ml-auto mb-10 mr-14 w-[320px] bg-green-300`}
				>
					<Text style={tw`text-2xl text-gray-800`}>Process Success!</Text>
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
		flexDirection: 'row',
		paddingStart: 16,
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
