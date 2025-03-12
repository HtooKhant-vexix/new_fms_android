import { colors } from '@/constants/tokens'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface SimpleSwitchProps {
	value: boolean
	onValueChange: (value: boolean) => void
	disabled?: boolean
}

const SimpleSwitch = ({ value, onValueChange, disabled = false }: SimpleSwitchProps) => {
	const handlePress = () => {
		if (!disabled) {
			onValueChange(!value)
		}
	}

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={handlePress} disabled={disabled}>
			<View style={[styles.track, { backgroundColor: value ? colors.primary : colors.textMuted }]}>
				<View
					style={[
						styles.thumb,
						{
							transform: [{ translateX: value ? 95 : 2 }],
							backgroundColor: 'white',
						},
					]}
				/>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	track: {
		width: 180,
		height: 83,
		borderRadius: 100,
		padding: 3,
	},
	thumb: {
		width: 76,
		height: 76,
		borderRadius: 100,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
})

export default SimpleSwitch
