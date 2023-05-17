export default class Message {
	constructor(symbols = []) {
		this.symbols = symbols;
		this.date = Date();
	}

	get isEmpty() {
		return this.symbols.length === 0;
	}
}
