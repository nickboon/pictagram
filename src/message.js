export default class Message {
	constructor(symbols = []) {
		this.symbols = symbols;
		this.date = Date();
	}

	get isEmpty() {
		return this.symbols.lenth === 0;
	}

	clear() {
		this.symbols.length = 0;
	}
}
