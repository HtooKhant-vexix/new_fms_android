import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Define TypeScript interfaces following coding standards
interface Item {
	id: string
	name: string
	description: string
}

interface ItemListProps {
	onItemSelect?: (item: Item) => void
	refreshInterval?: number
}

// Create a functional component using hooks
const ItemList: React.FC<ItemListProps> = ({ onItemSelect, refreshInterval = 30000 }) => {
	// State management following best practices
	const [items, setItems] = useState<Item[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [refreshing, setRefreshing] = useState<boolean>(false)

	// Memoized fetch function to prevent unnecessary re-renders
	const fetchItems = useCallback(async (showLoading = true) => {
		try {
			if (showLoading) setLoading(true)
			// Using axios instance from our API structure
			const response = await axios.get('/api/items')
			setItems(response.data)
			setError(null)
		} catch (err) {
			// Proper error handling as per API guidelines
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to fetch items. Please try again later.'
			setError(errorMessage)
			console.error('Error fetching items:', err)
		} finally {
			if (showLoading) setLoading(false)
			setRefreshing(false)
		}
	}, [])

	// Initial fetch and refresh interval
	useEffect(() => {
		fetchItems()

		const intervalId = setInterval(() => {
			fetchItems(false)
		}, refreshInterval)

		return () => clearInterval(intervalId)
	}, [fetchItems, refreshInterval])

	// Memoized render item function for better performance
	const renderItem = useCallback(
		({ item }: { item: Item }) => (
			<TouchableOpacity
				style={styles.itemContainer}
				onPress={() => onItemSelect?.(item)}
				activeOpacity={0.7}
			>
				<Text style={styles.itemName}>{item.name}</Text>
				<Text style={styles.itemDescription}>{item.description}</Text>
			</TouchableOpacity>
		),
		[onItemSelect],
	)

	// Memoized key extractor
	const keyExtractor = useCallback((item: Item) => item.id, [])

	// Memoized onRefresh handler
	const handleRefresh = useCallback(() => {
		setRefreshing(true)
		fetchItems(false)
	}, [fetchItems])

	// Render loading state
	if (loading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" />
			</View>
		)
	}

	// Render error state
	if (error) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		)
	}

	// Main render following component structure guidelines
	return (
		<View style={styles.container}>
			<FlatList
				data={items}
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				onRefresh={handleRefresh}
				refreshing={refreshing}
				initialNumToRender={10}
				maxToRenderPerBatch={10}
				windowSize={5}
				removeClippedSubviews={true}
			/>
		</View>
	)
}

// Styles following the styling guidelines
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemContainer: {
		padding: 16,
		backgroundColor: '#fff',
		borderRadius: 8,
		marginBottom: 8,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	itemName: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	itemDescription: {
		fontSize: 14,
		color: '#666',
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
	},
})

export default ItemList
