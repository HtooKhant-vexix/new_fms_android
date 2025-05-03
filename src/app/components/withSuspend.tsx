import React, { ComponentType, Suspense } from 'react'
import { ActivityIndicator, View } from 'react-native'

const withSuspend = <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
	return (props: P) => (
		<Suspense
			fallback={
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			}
		>
			<Component {...props} />
		</Suspense>
	)
}

export default withSuspend
