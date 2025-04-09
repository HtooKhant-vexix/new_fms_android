import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import tw from 'twrnc'
import { colors } from '../../../constants/tokens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'

const Input = ({e}) => {
	const [noz, setNoz] = useState()
    // console.log(e, '.....')

        const storeFun = async (value) => {
            try {
                const jsonValue = JSON.stringify(value)
                await AsyncStorage.setItem('info', jsonValue)
                Toast.show({
                    type: 'success',
                    text1: 'Saved Successfully!',
                    text2: 'Data has been saved successfully.',
                    // position: 'bottom',
                })
                console.log('stored')
            } catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Something was wrong!',
                    text2: 'Data has not been saved successfully.',
                    // position: 'bottom',
                })
                console.log(e, 'this is error')
            }
        }

	return (
		<View style={tw`w-[45%]`}>
			<View>
				<Text style={tw`text-2xl mb-1`}> Nozzle : {e?.nozzle_no}</Text>
				<Text style={tw`text-2xl mb-2`}> Fuel : {e?.fuel_type}</Text>
				<TextInput
					placeholder="Price"
					style={tw`w-full text-2xl`}
					onChangeText={(i) => setNoz(i)}
					value={noz}
					// right={<TextInput.Icon icon="email" />}
				/>
			</View>
			<Button
				// icon="camera"    
				// loading={true}
				buttonColor={colors.primary}
				mode="contained"
				style={tw`py-2 rounded-md mt-2 ml-auto w-[120px] `}
				onPress={() => storeFun()}
				uppercase={true}
			>
				Save
			</Button>
		</View>
	)
}

export default Input
