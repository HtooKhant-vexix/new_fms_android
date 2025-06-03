// import { FloatingPlayer } from '@/components/FloatingPlayer'
import { colors, fontSize } from '@/constants/tokens'
// import { BlurView } from 'expo-blur'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { Tabs } from 'expo-router'
import React, { useMemo } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'

interface TabBarStyle extends ViewStyle {
	position: 'absolute'
	borderTopLeftRadius: number
	borderTopRightRadius: number
	borderTopWidth: number
	paddingTop: number
	display: 'none'
}

interface TabBarLabelStyle {
	fontSize: number
	fontWeight: '500'
}

const TabsNavigation: React.FC = () => {
	const tabBarStyle: TabBarStyle = {
		position: 'absolute',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderTopWidth: 0,
		paddingTop: 8,
		display: 'none',
	}

	const tabBarLabelStyle: TabBarLabelStyle = {
		fontSize: fontSize.xs,
		fontWeight: '500',
	}

	const screenOptions = useMemo<BottomTabNavigationOptions>(
		() => ({
			tabBarActiveTintColor: colors.primary,
			tabBarLabelStyle,
			headerShown: false,
			tabBarStyle,
		}),
		[],
	)

	return (
		<>
			<Tabs screenOptions={screenOptions}>
				{/* <Tabs.Screen
					name="favorites"
					options={{
						title: 'Favorites',
						tabBarIcon: ({ color }) => <FontAwesome name="heart" size={20} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="playlists"
					options={{
						title: 'Playlists',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons name="playlist-play" size={28} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="(songs)"
					options={{
						title: 'Songs',
						tabBarIcon: ({ color }) => (
							<Ionicons name="musical-notes-sharp" size={24} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="artists"
					options={{
						title: 'Artists',
						tabBarIcon: ({ color }) => <FontAwesome6 name="users-line" size={20} color={color} />,
					}}
				/> */}
			</Tabs>

			{/* <FloatingPlayer
				style={{
					position: 'absolute',
					left: 8,
					right: 8,
					bottom: 78,
				}}
			/> */}
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	blurView: {
		...StyleSheet.absoluteFillObject,
		overflow: 'hidden',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
})

export default TabsNavigation
