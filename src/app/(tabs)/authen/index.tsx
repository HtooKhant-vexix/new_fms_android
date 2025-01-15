import useStore from '@/store/library'
import React, { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'

const index = () => {
	const { items, isLoading, error, fetchItems } = useStore()
	let start = new Date()
	start.setHours(0)
	start.setMinutes(0)
	start.setSeconds(0)
	start = new Date(start)

	let end = new Date()
	end.setHours(23)
	end.setMinutes(59)
	end.setSeconds(59)
	end = new Date(end)

	const route = `detail-sale/pagi/by-date/1?sDate=${start}&eDate=${end}`

	console.log(items.result, 'this is data')

	useEffect(() => {
		fetchItems(route)
	}, [])

	// console.log(items, isLoading, error)
	return (
		<View>
			<Text>index is:</Text>
			<Pressable>
				<Text>onclick</Text>
			</Pressable>
		</View>
	)
}

export default index
