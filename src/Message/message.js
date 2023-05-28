export default class Message {
	constructor(authors = ['anon'], symbolPositions = 'absolute', body = []) {
		this.authors = authors;
		this.symbolPositions = symbolPositions;
		this.body = body;
		this.replies = [];
	}

	get isEmpty() {
		return this.body.length === 0;
	}

	get length() {
		return this.body.length;
	}

	set selected(index) {
		this.body.map((symbol) => (symbol.isSelected = false));
		this.body[index].isSelected = true;
	}

	empty() {
		this.body.length = 0;
	}
}
