// GlobalState.js
import React, { createContext, useContext, useReducer } from 'react'

// Initial state
const initialState = {
	isConnected: false,
	dispenserStatus: null,
	fuelLevel: 0,
	nozzleActive: false,
}

// Actions
const reducer = (state, action) => {
	switch (action.type) {
		case 'SET_CONNECTION':
			return { ...state, isConnected: action.payload }
		case 'SET_DISPENSER_STATUS':
			return { ...state, dispenserStatus: action.payload }
		case 'SET_FUEL_LEVEL':
			return { ...state, fuelLevel: action.payload }
		case 'NOZZLE_ACTIVE':
			console.log('NOZZLE_ACTIVE', action.payload, '.................................')
			return { ...state, nozzleActive: action.payload }
		default:
			return state
	}
}

// Create context
const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	return <GlobalContext.Provider value={{ state, dispatch }}>{children}</GlobalContext.Provider>
}

// Custom hook to use global state
export const useGlobalState = () => useContext(GlobalContext)
