import { Tabs } from 'expo-router'

const TabsNavigation = () => {
	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="favorites" />
			<Tabs.Screen name="playlist" />
			<Tabs.Screen name="(songs)" />
			<Tabs.Screen name="artists" />
		</Tabs>
	)
}

export default TabsNavigation
