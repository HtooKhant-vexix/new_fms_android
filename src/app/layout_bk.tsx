// import { playbackService } from '@/constants/playbackService'
// import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
// import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'
// import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Suspense, useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import { GlobalProvider } from '../store/globalState'
// import TrackPlayer from 'react-native-track-player'
// import '../styles/config.css'
SplashScreen.preventAutoHideAsync()
// TrackPlayer.registerPlaybackService(() => playbackService)

const App = () => {
	// const handleTrackPlayerLoaded = useCallback(() => {
	// 	SplashScreen.hideAsync()
	// }, [])

	// useSetupTrackPlayer({
	// 	onLoad: handleTrackPlayerLoaded,
	// })
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

	if (!isReady) return null

	// useLogTrackPlayerState()

	// const location = usePathname()

	const toastConfig = {
		/*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
		success: (props) => (
			<BaseToast
				{...props}
				style={{ borderLeftColor: 'green', height: 100, width: 480 }}
				contentContainerStyle={{ marginVertical: 'auto' }}
				text1Style={{
					fontSize: 30,
					color: 'green',
					fontWeight: '400',
				}}
				text2Style={{
					fontSize: 25,
					// color: 'green',
					fontWeight: '400',
				}}
			/>
		),
		/*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
		error: (props) => (
			<ErrorToast
				{...props}
				style={{ borderLeftColor: 'red', height: 100, width: 490 }}
				contentContainerStyle={{ marginVertical: 'auto' }}
				text1Style={{
					fontSize: 30,
					color: 'red',
					fontWeight: '400',
				}}
				text2Style={{
					fontSize: 25,
					// color: 'red',
					fontWeight: '400',
				}}
			/>
		),
		/*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
		tomatoToast: ({ text1, props }) => (
			<View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
				<Text>{text1}</Text>
				<Text>{props.uuid}</Text>
			</View>
		),
	}

	return (
		<GlobalProvider>
			<SafeAreaProvider>
				<PaperProvider>
					{/* <GestureHandlerRootView style={{ flex: 1 }}> */}
					{/* {location == '/login' ? null : <Header />} */}
					{/* <Header /> */}
					{/* {config ? <RootNavigation /> : <SetupWizard />} */}
					<Suspense
						fallback={
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
								<ActivityIndicator size="large" color="#0000ff" />
							</View>
						}
					>
						<RootNavigation />
					</Suspense>
					{/* <SetupWizard /> */}
					<StatusBar hidden />
					<Toast position="bottom" bottomOffset={80} visibilityTime={2000} config={toastConfig} />
				</PaperProvider>
				{/* </GestureHandlerRootView> */}
			</SafeAreaProvider>
		</GlobalProvider>
	)
}

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />

			{/* <Stack.Screen
				name="player"
				options={{
					presentation: 'card',
					gestureEnabled: true,
					gestureDirection: 'vertical',
					animationDuration: 400,
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="(modals)/addToPlaylist"
				options={{
					presentation: 'modal',
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerTitle: 'Add to playlist',
					headerTitleStyle: {
						color: colors.text,
					},
				}}
			/> */}
		</Stack>
	)
}

export default App
