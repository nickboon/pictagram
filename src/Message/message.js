export default class Message {
	constructor(authors = ['anon'], symbolPositions = 'absolute', body = []) {
		this.authors = authors;
		this.symbolPositions = symbolPositions;
		this.body = body;
	}

	get isEmpty() {
		return this.body.length === 0;
	}
}
