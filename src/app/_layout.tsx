// import { playbackService } from '@/constants/playbackService'
// import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
// import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { SplashScreen, Stack, usePathname } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'
// import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Header from './components/Header'
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

	// useLogTrackPlayerState()

	const location = usePathname()

	return (
		<SafeAreaProvider>
			<PaperProvider>
				{/* <GestureHandlerRootView style={{ flex: 1 }}> */}
				{location == '/login' ? null : <Header />}
				{/* <Header /> */}
				<RootNavigation />
				<StatusBar hidden />
			</PaperProvider>
			{/* </GestureHandlerRootView> */}
		</SafeAreaProvider>
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
