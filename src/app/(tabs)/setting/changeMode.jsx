'use client'

import SimpleSwitch from '@/app/components/SimpleSwitch'
import { colors } from '@/constants/tokens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import tw from 'twrnc'
import backImg from '../../../../assets/bg.png'

const ChangeMode = () => {
	const [isDirectMode, setIsDirectMode] = useState(true)
	const router = useRouter()
	console.log(isDirectMode, '---- this is mode')

	useEffect(() => {
		const loadMode = async () => {
			try {
				const storedMode = await AsyncStorage.getItem('Mode')
				console.log(storedMode, 'this is stored mode')
				if (storedMode !== null) {
					setIsDirectMode(storedMode === 'Direct')
				}
			} catch (error) {
				console.error('Error loading mode:', error)
			}
		}
		loadMode()
	}, [])

	const toggleMode = async () => {
		try {
			const newMode = isDirectMode ? 'Server' : 'Direct'
			await AsyncStorage.setItem('Mode', newMode)
			setIsDirectMode(!isDirectMode)
		} catch (error) {
			console.error('Error saving mode:', error)
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={backImg} resizeMode="cover" style={styles.image}>
				<View style={styles.card}>
					<View style={tw` p-4 flex flex-col gap-3 mr-4`}>
						<TouchableOpacity
							onPress={() => router.push(`/(tabs)/setting`)}
							style={tw`flex flex-row w-33  items-start`}
						>
							<Text
								style={tw`text-[20px] font-semibold rounded-md bg-[${colors.primary}] w-full text-center py-4 text-white`}
							>
								FN KEY
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => router.push(`/(tabs)/setting/info`)}
							style={tw`flex flex-row w-33  items-start`}
						>
							<Text
								style={tw`text-[20px] font-semibold rounded-md bg-[${colors.primary}] w-full text-center py-4 text-white`}
							>
								INFO
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => router.push(`/(tabs)/setting/changeMode`)}
							style={tw`flex flex-row w-33  items-start`}
						>
							<Text
								style={tw`text-[20px] font-semibold rounded-md bg-[${colors.primary}] w-full text-center py-4 text-white`}
							>
								Mode
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => router.push(`/(tabs)/setting/priceChg`)}
							style={tw`flex flex-row w-33  items-start`}
						>
							<Text
								style={tw`text-[20px] font-semibold rounded-md bg-[${colors.primary}] w-full text-center py-4 text-white`}
							>
								Price
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.card_con}>
						<Text style={styles.title}>
							Current Mode :{' '}
							<Text style={styles.sub_title}>{isDirectMode == true ? 'Direct' : 'Server'}</Text>
						</Text>
						<View style={styles.switchContainer}>
							<Text style={styles.label}>Server</Text>
							<SimpleSwitch value={isDirectMode} onValueChange={toggleMode} />
							<Text style={styles.label}>Direct</Text>
						</View>
					</View>
				</View>
			</ImageBackground>
		</SafeAreaView>
	)
}

export default ChangeMode

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	card_con: {
		display: 'flex',
		// backgroundColor: '#fedd00',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 'auto',
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
		marginHorizontal: 'auto',
		width: 1040,
		display: 'flex',
		flexDirection: 'row',
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	image: {
		flex: 1,
		// justifyContent: 'center',
		paddingTop: 18
	},
	title: {
		fontSize: 38,
		// fontWeight: 'bold',
		marginBottom: 24,
	},
	sub_title: {
		fontSize: 40,
		fontWeight: 'semibold',
		marginBottom: 24,
		color: colors.primary,
	},
	switchContainer: {
		display: 'flex',
		backgroundColor: '#fff',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 26,
	},
	label: {
		fontSize: 32,
	},
})
