import { blocks } from './unicodeBlock.js';

const allCodes = blocks.map((block) => block.codes).flat();
const minChar = String.fromCodePoint(Math.min(...allCodes));
const maxChar = String.fromCodePoint(Math.max(...allCodes));
const symbolTextRegex = new RegExp(`^[${minChar}-${maxChar}]{1,2}\s?$`, 'u');

export default class {
	static get username() {
		return {
			isValid: (value) => /^[a-zA-Z0-9_.\-@]+$/.test(value),
			message: 'Valid characters: a-z, A-Z, 0-9, _, ., - and @',
		};
	}

	static get symbolText() {
		return {
			isValid: (value) => symbolTextRegex.test(value),
			message: 'Unsuported character.',
		};
	}
}
