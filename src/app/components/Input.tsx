import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'

interface InputProps {
	label: string
	value: string | number
	setValue?: (value: string) => void
	onPress?: () => void
	style?: string
	disabled?: boolean
	error?: string
	placeholder?: string
	accessibilityLabel?: string
}

const Input: React.FC<InputProps> = ({
	label,
	value,
	setValue,
	onPress,
	style = '',
	disabled = false,
	error,
	placeholder,
	accessibilityLabel,
}) => {
	const handlePress = () => {
		if (disabled) return
		onPress?.()
	}

	const containerStyle = React.useMemo(
		() => [
			tw`bg-gray-300 mx-auto border-0 rounded-md pl-6 w-[370px] h-[100px] mb-4 focus:bg-gray-200 flex items-end ${
				disabled ? 'opacity-50' : ''
			} ${error ? 'border-2 border-red-500' : ''} ${style}`,
		],
		[disabled, error, style],
	)

	const valueStyle = React.useMemo(
		() => [
			tw`text-gray-700 flex pr-7 text-[74px] font-semibold`,
			!value && placeholder && tw`text-gray-400`,
		],
		[value, placeholder],
	)

	return (
		<View style={styles.container}>
			<Text style={tw`text-[30px] ml-2 mb-2 font-medium`}>{label}:</Text>
			<TouchableOpacity
				onPress={handlePress}
				disabled={disabled}
				accessibilityRole="button"
				accessibilityLabel={accessibilityLabel || `${label} input`}
				accessibilityState={{ disabled }}
				accessibilityHint={onPress ? 'Double tap to open input' : undefined}
			>
				<View style={containerStyle}>
					<Text style={valueStyle} numberOfLines={1} ellipsizeMode="tail">
						{value || placeholder}
					</Text>
				</View>
			</TouchableOpacity>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	errorText: {
		color: 'red',
		marginLeft: 8,
		marginTop: 4,
		fontSize: 14,
	},
})

export default Input
