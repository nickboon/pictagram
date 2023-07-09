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
			authors: [],
			symbolPositions: Message.symbolPositions.absolute,
		};
	}

	static get reactions() {
		return {
			downloaded: 'downloaded',
			repliedTo: 'repliedTo',
			recycled: 'recycled',
			liked: 'liked',
		};
	}
}
