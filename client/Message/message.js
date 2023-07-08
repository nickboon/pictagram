import Constants from '../../domain/message';

export default class Message {
	constructor({
		authors = Constants.default.authors,
		symbolPositions = Constants.default.symbolPositions,
		body = [],
		isRecycled = false,
	} = {}) {
		this.authors = authors;
		this.symbolPositions = symbolPositions;
		this.body = body;
		this.isRecycled = isRecycled;
		this.downloadedBy = [];
	}

	get isEmpty() {
		return this.body.length === 0;
	}

	get length() {
		return this.body.length;
	}

	/**
	 * @param {number} index
	 */
	set selected(index) {
		this.body.map((symbol) => (symbol.isSelected = false));
		this.body[index].isSelected = true;
	}

	static clone(message) {
		const properties = JSON.parse(JSON.stringify(message));
		const clone = new Message(properties);
		clone.date = message.date;

		return clone;
	}

	empty() {
		this.body.length = 0;
	}

	setOffset(symbolElements) {
		this.body.forEach((symbol, index) => {
			const symbolElement = symbolElements[index];
			symbol.offsetLeft = symbolElement.offsetLeft;
			symbol.offsetTop = symbolElement.offsetTop;
		});
		return this;
	}

	toAbsolute(symbolElements) {
		if (this.symbolPositions === Constants.symbolPositions.absolute)
			return this;

		this.body.forEach((symbol, index) => {
			const symbolElement = symbolElements[index];
			symbol.x = symbolElement.offsetLeft + symbol.x;
			symbol.y = symbolElement.offsetTop + symbol.y;
			symbol.offsetLeft = 0;
			symbol.offsetTop = 0;
		});

		this.symbolPositions = Constants.symbolPositions.absolute;
		return this;
	}

	toRelative() {
		this.symbolPositions = Constants.symbolPositions.relative;
		return this;
	}

	restoreOffset(symbolElements) {
		if (symbolElements.length === 0) return;

		this.body.forEach((symbol, index) => {
			const symbolElement = symbolElements[index];
			symbol.x -= symbolElement.offsetLeft;
			symbol.y -= symbolElement.offsetTop;
		});

		return this;
	}
}
