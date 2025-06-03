import SetupWizard from '@/app/components/Setup'
import React from 'react'
import { View } from 'react-native'

const SetupScreen: React.FC = () => {
	return (
		<View style={{ flex: 1 }}>
			<SetupWizard />
		</View>
	)
}

export default SetupScreen
