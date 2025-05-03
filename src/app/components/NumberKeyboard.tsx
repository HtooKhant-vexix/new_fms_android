import { colors } from '@/constants/tokens'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
interface NumberKeyboardProps {
	isVisible: boolean
	onKeyPress: (key: string) => void
	onClose: () => void
	literValue: string | number
	priceValue: string | number
	condi: string
}

const { width } = Dimensions.get('window')

const NumberKeyboard: React.FC<NumberKeyboardProps> = ({
	isVisible,
	onKeyPress,
	onClose,
	literValue,
	priceValue,
	condi,
}) => {
	const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']
	const slideAnim = useRef(new Animated.Value(width)).current

	useEffect(() => {
		if (isVisible) {
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start()
		} else {
			Animated.timing(slideAnim, {
				toValue: width,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
	}, [isVisible, slideAnim])

	return (
		<Animated.View
			style={[
				styles.kcontainer,
				{
					transform: [{ translateX: slideAnim }],
				},
			]}
		>
			<TouchableOpacity style={styles.closeButton} onPress={onClose}>
				<Text style={styles.closeButtonText}>Close</Text>
			</TouchableOpacity>
			<View
				style={tw`bg-gray-300 mx-auto border-0 rounded-md pl-6 w-[500px] absolute top-8 h-[130px] right-50 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 flex items-end focus:ring-blue-500`}
			>
				<Text
					style={tw` text-gray-700 flex pr-10 text-[94px] font-semibold`}
					// onChangeText={(text) => setValue(text)}
				>
					{condi == 'liter' ? literValue : priceValue}
				</Text>
			</View>
			<View style={styles.keypadContainer}>
				{numbers.map((num) => (
					<TouchableOpacity key={num} style={styles.key} onPress={() => onKeyPress(num)}>
						<Text style={styles.keyText}>{num}</Text>
					</TouchableOpacity>
				))}
				<TouchableOpacity style={styles.key} onPress={() => onKeyPress('delete')}>
					<Text style={styles.keyText}>⌫</Text>
				</TouchableOpacity>
			</View>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	kcontainer: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		width: '80%',
		backgroundColor: '#f0f0f0',
		padding: 20,
		justifyContent: 'center',
		zIndex: 50,
	},
	closeButton: {
		position: 'absolute',
		top: 76,
		left: 40,
		paddingHorizontal: 26,
		paddingVertical: 10,
		backgroundColor: colors.primary,
		borderRadius: 8,
	},
	closeButtonText: {
		fontSize: 26,
		color: 'white',
	},
	keypadContainer: {
		marginTop: 320,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	key: {
		width: '30%',
		aspectRatio: 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		margin: 5,
		borderRadius: 5,
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	keyText: {
		fontSize: 24,
		fontWeight: 'bold',
	},
})

export default NumberKeyboard
