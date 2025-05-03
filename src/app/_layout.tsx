import { SplashScreen } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { Suspense, useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import { GlobalProvider } from '../store/globalState'

SplashScreen.preventAutoHideAsync()

const RootNavigation = React.lazy(() => import('./RootNavigation'))

const App = () => {
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		// Simulate setup tasks (e.g., fetching config, initializing services)
		const prepareApp = async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate loading
			setIsReady(true)
			SplashScreen.hideAsync()
		}
		prepareApp()
	}, [])

	const toastConfig = {
		success: (props) => (
			<BaseToast
				{...props}
				style={{ borderLeftColor: 'green', height: 100, width: 480 }}
				contentContainerStyle={{ marginVertical: 'auto' }}
				text1Style={{ fontSize: 30, color: 'green', fontWeight: '400' }}
				text2Style={{ fontSize: 25, fontWeight: '400' }}
			/>
		),
		error: (props) => (
			<ErrorToast
				{...props}
				style={{ borderLeftColor: 'red', height: 100, width: 490 }}
				contentContainerStyle={{ marginVertical: 'auto' }}
				text1Style={{ fontSize: 30, color: 'red', fontWeight: '400' }}
				text2Style={{ fontSize: 25, fontWeight: '400' }}
			/>
		),
		tomatoToast: ({ text1, props }) => (
			<View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
				<Text>{text1}</Text>
				<Text>{props.uuid}</Text>
			</View>
		),
	}

	if (!isReady) return null

	return (
		<GlobalProvider>
			<SafeAreaProvider>
				<PaperProvider>
					<Suspense
						fallback={
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
								<ActivityIndicator size="large" color="#0000ff" />
							</View>
						}
					>
						<RootNavigation />
					</Suspense>
					<StatusBar hidden />
					<Toast position="bottom" bottomOffset={80} visibilityTime={2000} config={toastConfig} />
				</PaperProvider>
			</SafeAreaProvider>
		</GlobalProvider>
	)
}

export default App
