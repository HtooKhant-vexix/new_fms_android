import * as React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Modal, Portal, Text } from 'react-native-paper'

interface LoadingProps {
	visible: boolean
	message?: string
	onDismiss?: () => void
}

const Loading: React.FC<LoadingProps> = ({ visible, message = 'Loading...', onDismiss }) => {
	const containerStyle = React.useMemo(
		() => ({
			...styles.container,
			backgroundColor: 'white',
		}),
		[],
	)

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={onDismiss}
				contentContainerStyle={containerStyle}
				dismissable={!!onDismiss}
			>
				<View style={styles.content}>
					<ActivityIndicator size="large" color="#0000ff" />
					<Text style={styles.message}>{message}</Text>
				</View>
			</Modal>
		</Portal>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		margin: 20,
		borderRadius: 8,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	content: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	message: {
		marginTop: 12,
		fontSize: 16,
		textAlign: 'center',
	},
})

export default Loading
