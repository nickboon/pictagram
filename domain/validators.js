export default class {
	static get username() {
		return {
			isValid: (value) => /^[a-zA-Z0-9_.\-@]+$/.test(value),
			message: 'Valid characters: a-z, A-Z, 0-9, _, ., - and @',
		};
	}

	static get symbolText() {
		return {
			isValid: (value) => /^[←-🫶]{1}$/.test(value),
			message: 'Unsuported character.',
		};
	}
}
