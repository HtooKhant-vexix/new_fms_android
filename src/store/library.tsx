import { localInstance } from '@/api/axios'
import { router } from 'expo-router'
import { create } from 'zustand'

const useStore = create((set) => ({
	items: [],
	isLoading: false,
	error: null,

	// Fetch items from API
	fetchItems: async (route: string, token: string) => {
		set({ isLoading: true, error: null })
		console.log(route, token, '...')
		try {
			const response = await localInstance.get(route, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'multipart/form-data',
				},
			}) // Replace with your API endpoint
			console.log(response.data)
			set({ items: response.data, isLoading: false })
		} catch (error) {
			set({ error, isLoading: false })
		}
	},

	// // Create a new item
	// createItem: async (newItem) => {
	// 	try {
	// 		const response = await axios.post('/api/items', newItem)
	// 		set((state) => ({ items: [...state.items, response.data] }))
	// 	} catch (error) {
	// 		console.error('Error creating item:', error)
	// 	}
	// },

	// // Update an item
	// updateItem: async (itemId, updatedItem) => {
	// 	try {
	// 		await axios.put(`/api/items/${itemId}`, updatedItem)
	// 		set((state) => ({
	// 			items: state.items.map((item) => (item.id === itemId ? updatedItem : item)),
	// 		}))
	// 	} catch (error) {
	// 		console.error('Error updating item:', error)
	// 	}
	// },

	// // Delete an item
	// deleteItem: async (itemId) => {
	// 	try {
	// 		await axios.delete(`/api/items/${itemId}`)
	// 		set((state) => ({
	// 			items: state.items.filter((item) => item.id !== itemId),
	// 		}))
	// 	} catch (error) {
	// 		console.error('Error deleting item:', error)
	// 	}
	// },
}))

const DevControl = create((set) => ({
	dev: [],
	vou: [],
	presetLoading: false,
	permitLoading: false,
	isLoading: false,
	error: null,
	alert: false,

	// Fetch items from API
	// `detail-sale/preset?depNo=${obj.dep_no}&nozzleNo=${obj.nozzle_no}`
	presetFun: async (route: string, data: any, token: string) => {
		set({ presetLoading: true, error: null, alert: false })
		try {
			const response = await localInstance.post(route, data, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'multipart/form-data',
				},
			})
			set({ vou: response.data, presetLoading: false, alert: true })
			router.push('/(tabs)/(dispenser)')
			setTimeout(() => {
				set({ alert: false })
			}, 3000)
		} catch (error) {
			set({ error, presetLoading: false })
		}
	},

	permitFun: async (route: string, data: any, token: string) => {
		set({ presetLoading: true, error: null, alert: false })
		try {
			const response = await localInstance.post(route, data, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'multipart/form-data',
				},
			})
			set({ vou: response.data, presetLoading: false, alert: true })
			router.push('/(tabs)/(dispenser)')
			setTimeout(() => {
				set({ alert: false })
			}, 3000)
		} catch (error) {
			set({ error, presetLoading: false })
		}
	},

	getDev: async (token: string) => {
		set({ isLoading: true, error: null })
		try {
			const response = await localInstance.get(`/device`, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'multipart/form-data',
				},
			}) // Replace with your API endpoint
			// console.log(response.data)
			set({ dev: response.data, isLoading: false })
		} catch (error) {
			set({ error, isLoading: false })
		}
	},
}))

const Auth = create((set) => ({
	items: [],
	isLoading: false,
	error: null,

	authPost: async (route: string, data: any) => {
		set({ isLoading: true, error: null })
		// console.log(data, 'this is from data ..')
		try {
			const response = await localInstance.post(route, data, {
				headers: {
					'Content-Type': 'multipart/form-data',
					// Authorization: 'Bearer ' + '',
				},
			}) // Replace with your API endpoint
			// console.log(response.data)
			set({ items: response.data, isLoading: false })
		} catch (error) {
			set({ error, isLoading: false })
		}
	},
}))

const Token = create((set) => ({
	items: '',

	setToken: async (data: string) => {
		set({ isLoading: true, error: null })
		// console.log(data, 'this is from data ..')
		try {
			// const response = await localInstance.post(route, data, {
			// 	headers: {
			// 		'Content-Type': 'multipart/form-data',
			// 		// Authorization: 'Bearer ' + '',
			// 	},
			// }) // Replace with your API endpoint
			// // console.log(response.data)
			set({ items: data, isLoading: false })
		} catch (error) {
			set({ error, isLoading: false })
		}
	},
}))

export { Auth, DevControl, Token, useStore }
