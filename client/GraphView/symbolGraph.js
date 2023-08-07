import TalliedMap from './talliedMap';

export default class SymbolGraph {
	static #edgeIdSeparator = '_';

	#messages = [];
	#interMessageSymbolEdgeMap = new TalliedMap();
	#allSymbolEdgeMap = new TalliedMap();
	#symbolMap = new TalliedMap();

	static toEdgeId(a, b) {
		return `${a}${SymbolGraph.#edgeIdSeparator}${b}`;
	}

	setMessages(messages, from = 0, to = 100) {
		this.#messages = messages.slice(from, to);

		this.#messages.flat().forEach((message) => {
			message.body.forEach((symbol) => {
				this.#symbolMap.set(symbol.text, symbol);
			});
		});
		return this;
	}

	get symbolMap() {
		return this.#symbolMap;
	}

	get interMessageSymbolEdgeMap() {
		return this.#interMessageSymbolEdgeMap;
	}

	get symbolEdgeMap() {
		return this.#allSymbolEdgeMap;
	}

	filterSymbolsByMinimumCount(minimum) {
		console.log('filterSymbolsByMinimumCount', minimum);
		this.#interMessageSymbolEdgeMap.filter(
			(key, value) => value.tally > minimum
		);
		this.#allSymbolEdgeMap.filter((key, value) => value.tally > minimum);
		this.#symbolMap.filter((key, value) => value.tally > minimum);
		return this;
	}

	setInterMessageSymbolEdges() {
		this.#messages.forEach((message) =>
			SymbolGraph.#setEdges(message.body, this.#interMessageSymbolEdgeMap)
		);
		return this;
	}

	setAllSymbolEdges() {
		SymbolGraph.#setEdges(this.#symbolMap.values, this.#allSymbolEdgeMap);
		return this;
	}

	static #setEdges(symbols, edgeMap) {
		symbols.flatMap((a, i) =>
			symbols.slice(i + 1).forEach((b) =>
				edgeMap.set(SymbolGraph.toEdgeId(a.text, b.text), {
					aId: a.text,
					bId: b.text,
				})
			)
		);
	}
}
