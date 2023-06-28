export default class Message {
	static get symbolPositions() {
		return {
			relative: 'relative',
			absolute: 'absolute',
		};
	}

	static get default() {
		return {
			author: 'anon',
			authors: ['anon'],
			symbolPositions: Message.symbolPositions.absolute,
		};
	}
}
