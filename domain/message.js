export default class Message {
	static get symbolPositions() {
		return {
			relative: 'relative',
			absolute: 'absolute',
		};
	}

	static get default() {
		return {
			author: 'Anon',
			authors: ['Anon'],
			symbolPositions: Message.symbolPositions.absolute,
		};
	}
}
