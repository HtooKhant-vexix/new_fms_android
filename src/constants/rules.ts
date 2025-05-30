// Application Rules and Validation Logic

// Nozzle Configuration Rules
export const NOZZLE_RULES = {
	MIN_NOZZLE_COUNT: 1,
	MAX_NOZZLE_COUNT: 8,
	ADDRESS_LENGTH: 5,
	NUMBER_LENGTH: 2,
	ADDRESS_PATTERN: /^\d{5}$/,
	NUMBER_PATTERN: /^\d{2}$/,
}

// Price Rules
export const PRICE_RULES = {
	MIN_PRICE: 0,
	MAX_PRICE: 9999.99,
	DECIMAL_PLACES: 2,
	PRICE_PATTERN: /^\d{1,4}(\.\d{1,2})?$/,
}

// Station Information Rules
export const STATION_RULES = {
	NAME: {
		MIN_LENGTH: 3,
		MAX_LENGTH: 50,
		PATTERN: /^[a-zA-Z0-9\s\-&]+$/,
	},
	ADDRESS: {
		MIN_LENGTH: 5,
		MAX_LENGTH: 100,
		PATTERN: /^[a-zA-Z0-9\s\-\.,#]+$/,
	},
	CITY: {
		MIN_LENGTH: 2,
		MAX_LENGTH: 50,
		PATTERN: /^[a-zA-Z\s\-]+$/,
	},
	STATE: {
		MIN_LENGTH: 2,
		MAX_LENGTH: 50,
		PATTERN: /^[a-zA-Z\s\-]+$/,
	},
	PHONE: {
		PATTERN: /^\d{10,15}$/,
	},
}

// Validation Functions
export const validateNozzleConfig = (config: { number: string; address: string }) => {
	const errors: string[] = []

	if (!config.number.match(NOZZLE_RULES.NUMBER_PATTERN)) {
		errors.push(`Nozzle number must be ${NOZZLE_RULES.NUMBER_LENGTH} digits`)
	}

	if (!config.address.match(NOZZLE_RULES.ADDRESS_PATTERN)) {
		errors.push(`Nozzle address must be ${NOZZLE_RULES.ADDRESS_LENGTH} digits`)
	}

	return errors
}

export const validatePrice = (price: string) => {
	const errors: string[] = []
	const numPrice = parseFloat(price)

	if (isNaN(numPrice)) {
		errors.push('Price must be a valid number')
	} else {
		if (numPrice < PRICE_RULES.MIN_PRICE || numPrice > PRICE_RULES.MAX_PRICE) {
			errors.push(`Price must be between ${PRICE_RULES.MIN_PRICE} and ${PRICE_RULES.MAX_PRICE}`)
		}
		if (!price.match(PRICE_RULES.PRICE_PATTERN)) {
			errors.push(`Price can have up to ${PRICE_RULES.DECIMAL_PLACES} decimal places`)
		}
	}

	return errors
}

export const validateStationInfo = (info: {
	name: string
	address: string
	city: string
	state: string
	phone1: string
	phone2: string
}) => {
	const errors: string[] = []

	// Validate name
	if (
		info.name.length < STATION_RULES.NAME.MIN_LENGTH ||
		info.name.length > STATION_RULES.NAME.MAX_LENGTH
	) {
		errors.push(
			`Station name must be between ${STATION_RULES.NAME.MIN_LENGTH} and ${STATION_RULES.NAME.MAX_LENGTH} characters`,
		)
	}
	if (!info.name.match(STATION_RULES.NAME.PATTERN)) {
		errors.push('Station name contains invalid characters')
	}

	// Validate address
	if (
		info.address.length < STATION_RULES.ADDRESS.MIN_LENGTH ||
		info.address.length > STATION_RULES.ADDRESS.MAX_LENGTH
	) {
		errors.push(
			`Address must be between ${STATION_RULES.ADDRESS.MIN_LENGTH} and ${STATION_RULES.ADDRESS.MAX_LENGTH} characters`,
		)
	}
	if (!info.address.match(STATION_RULES.ADDRESS.PATTERN)) {
		errors.push('Address contains invalid characters')
	}

	// Validate city
	if (
		info.city.length < STATION_RULES.CITY.MIN_LENGTH ||
		info.city.length > STATION_RULES.CITY.MAX_LENGTH
	) {
		errors.push(
			`City must be between ${STATION_RULES.CITY.MIN_LENGTH} and ${STATION_RULES.CITY.MAX_LENGTH} characters`,
		)
	}
	if (!info.city.match(STATION_RULES.CITY.PATTERN)) {
		errors.push('City contains invalid characters')
	}

	// Validate state
	if (
		info.state.length < STATION_RULES.STATE.MIN_LENGTH ||
		info.state.length > STATION_RULES.STATE.MAX_LENGTH
	) {
		errors.push(
			`State must be between ${STATION_RULES.STATE.MIN_LENGTH} and ${STATION_RULES.STATE.MAX_LENGTH} characters`,
		)
	}
	if (!info.state.match(STATION_RULES.STATE.PATTERN)) {
		errors.push('State contains invalid characters')
	}

	// Validate phone numbers
	if (info.phone1 && !info.phone1.match(STATION_RULES.PHONE.PATTERN)) {
		errors.push('Primary phone number must be between 10 and 15 digits')
	}
	if (info.phone2 && !info.phone2.match(STATION_RULES.PHONE.PATTERN)) {
		errors.push('Secondary phone number must be between 10 and 15 digits')
	}

	return errors
}

// Business Rules
export const BUSINESS_RULES = {
	// Maximum number of active transactions per nozzle
	MAX_ACTIVE_TRANSACTIONS: 1,

	// Minimum time between transactions (in milliseconds)
	MIN_TRANSACTION_INTERVAL: 5000,

	// Maximum transaction amount
	MAX_TRANSACTION_AMOUNT: 999999.99,

	// Minimum transaction amount
	MIN_TRANSACTION_AMOUNT: 0.01,

	// Maximum number of price changes per day
	MAX_PRICE_CHANGES_PER_DAY: 3,

	// Maximum number of failed login attempts
	MAX_LOGIN_ATTEMPTS: 3,

	// Session timeout (in milliseconds)
	SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
}

// Error Messages
export const ERROR_MESSAGES = {
	INVALID_NOZZLE_CONFIG: 'Invalid nozzle configuration',
	INVALID_PRICE: 'Invalid price value',
	INVALID_STATION_INFO: 'Invalid station information',
	TRANSACTION_LIMIT_EXCEEDED: 'Transaction limit exceeded',
	PRICE_CHANGE_LIMIT_EXCEEDED: 'Price change limit exceeded for today',
	SESSION_EXPIRED: 'Session expired. Please login again',
	INVALID_CREDENTIALS: 'Invalid credentials',
	SYSTEM_ERROR: 'System error occurred',
	NETWORK_ERROR: 'Network connection error',
	SERIAL_PORT_ERROR: 'Serial port communication error',
	MQTT_ERROR: 'MQTT communication error',
}

// Success Messages
export const SUCCESS_MESSAGES = {
	CONFIG_SAVED: 'Configuration saved successfully',
	PRICE_UPDATED: 'Price updated successfully',
	TRANSACTION_COMPLETED: 'Transaction completed successfully',
	LOGIN_SUCCESS: 'Login successful',
	LOGOUT_SUCCESS: 'Logout successful',
}
