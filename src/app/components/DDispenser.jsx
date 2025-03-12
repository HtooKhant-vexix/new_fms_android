import { router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
const DDispenser = ({ title, description, iconSource, price, status, noz, dis }) => (
	<View style={styles.card}>
		<View
			style={tw`bg-white border-2 border-blue-300 shadow shadow-xl shadow-[#33b0f9] w-[100px] absolute flex items-center justify-around left-[-35px] text-center z-20 h-full rounded-full`}
		>
			<View
				style={tw`text-3xl border p-2 mt-1 rounded-full w-16 h-16 mx-auto flex items-center justify-center flex-row font-semibold`}
			>
				<Text style={tw`text-3xl font-semibold`}>{noz}</Text>
			</View>
			<Image
				source={require('../../../assets/gas-fuel.png')} // Replace with your logo
				style={tw`w-12 h-12 mb-6`}
			/>
		</View>
		<TouchableOpacity
			onPress={() => {
				router.push('/(tabs)/(dispenser)/auth'),
					router.setParams({
						noz: noz,
						dis: dis,
						price: price,
						fuel: title,
					})
			}}
			style={styles.cardContent}
		>
			{/* <View style={styles.cardIconContainer}>
                    <Image source={iconSource} style={styles.cardIcon} />
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDescription}>{description}</Text>
                </View> */}
			<View style={tw``}>
				<Text style={styles.cardTitle}>{title}</Text>
			</View>
			<View style={tw` flex flex-row gap-2 items-center`}>
				{/* .toLocaleString(undefined, {
                maximumFractionDigits: 3,
              }) */}
				<Text style={tw` text-[50px] font-bold mb-2  text-[#33b0f9]`}>
					{price?.toLocaleString(undefined, {
						maximumFractionDigits: 3,
					})}
				</Text>
				<Text style={tw` text-3xl`}> MMK</Text>
			</View>
			<View>
				<Text style={tw` text-2xl`}>
					<Text style={tw`font-semibold`}>Status: </Text>
					{status}
				</Text>
			</View>
		</TouchableOpacity>
	</View>
)

const styles = StyleSheet.create({
	card: {
		width: 450,
		height: 200,
		margin: 10,
		marginHorizontal: 28,
		marginStart: 40,
		backgroundColor: '#ffffff',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
	},
	cardContent: {
		paddingStart: 100,
		padding: 16,
		// flexDirection: 'row',
		// alignItems: 'start',
		gap: 2,
	},
	cardIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardIcon: {
		width: 24,
		height: 24,
	},
	cardTextContainer: {
		flex: 1,
	},
	cardTitle: {
		fontSize: 26,
		fontWeight: '600',
		marginBottom: 4,
	},
	cardDescription: {
		fontSize: 14,
		color: '#666666',
	},
})

export default DDispenser
