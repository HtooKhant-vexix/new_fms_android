import { localInstance } from '@/api/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { create } from 'zustand'

const useStore = create((set) => ({
	items: [],
	isLoading: false,
	error: null,

	fetchItems: async (route: string, token: string) => {
		set({ isLoading: true, error: null })
		try {
			const response = await localInstance.get(route, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			set({ items: response.data, isLoading: false })
		} catch (error) {
			set({ error, isLoading: false })
		}
	},
}))

const DevControl = create((set) => ({
	dev: [],
	vou: [],
	presetLoading: false,
	permitLoading: false,
	isLoading: false,
	error: null,
	alert: false,

	presetFun: async (route: string, data: any, token: string) => {
		set({ presetLoading: true, error: null, alert: false })
		try {
			const response = await localInstance.post(route, data, {
				headers: {
					Authorization: `Bearer ${token}`,
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
			console.log('console.log')
			const response = await localInstance.post(route, data, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			console.log(response)
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
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			console.log(response.data, 'this is dev data')
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
		try {
			const response = await localInstance.post(route, data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			set({ items: response.data, isLoading: false })
		} catch (error) {
			set({ error, isLoading: false })
		}
	},
}))

const Token = create((set) => ({
	items: '',
	isRefresh: false,
	setToken: async (data: string) => {
		set({ isLoading: true, error: null })
		try {
			set({ items: data, isLoading: false })
		} catch (error) {
			set({ error, isLoading: false })
		}
	},

	refresh: async (data: boolean) => {
		set({ isLoading: true, error: null })
		try {
			set({ isRefresh: data })
		} catch (error) {
			set({ error, isLoading: false })
		}
	},
}))

const nozConfig = create((set) => ({
	items: '',
	isLoading: false,
	error: null,

	setConfig: async (config: string) => {
		set({ isLoading: true, error: null })
		try {
			await AsyncStorage.setItem('fuelDispenserConfig', JSON.stringify(config))
			console.log('this is from library', JSON.stringify(config))
			set({
				items: JSON.stringify(config),
				isLoading: false,
			})
		} catch (error) {
			set({ error, isLoading: false })
		}
	},

	getConfig: async (config: string) => {
		set({ isLoading: true, error: null })
		try {
			const configString = await AsyncStorage.getItem('fuelDispenserConfig')
			set({
				items: configString,
				isLoading: false,
			})
		} catch (error) {
			set({ error, isLoading: false })
		}
	},
}))

export { Auth, DevControl, nozConfig, Token, useStore }
