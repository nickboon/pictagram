import TalliedMap from './talliedMap';
import SymbolAuthorMap from './authorMap';

export default class SymbolGraph {
	static #edgeIdSeparator = '_';

	#messages = [];
	#interMessageSymbolEdgeMap = new TalliedMap();
	#allSymbolEdgeMap = new TalliedMap();
	#symbolMap = new TalliedMap();
	#authorMap = new SymbolAuthorMap();
	#authorSet = new Set();

	get symbolMap() {
		return this.#symbolMap;
	}

	get interMessageSymbolEdgeMap() {
		return this.#interMessageSymbolEdgeMap;
	}

	get symbolEdgeMap() {
		return this.#allSymbolEdgeMap;
	}

	get authorMap() {
		return this.#authorMap;
	}

	get authorSet() {
		return this.#authorSet;
	}

	static toEdgeId(a, b) {
		return `${a}${SymbolGraph.#edgeIdSeparator}${b}`;
	}

	clear() {
		this.#allSymbolEdgeMap.clear();
		this.#interMessageSymbolEdgeMap.clear();
		this.#symbolMap.clear();
		return this;
	}

	setMessages(messages, from = 0, to = 100) {
		this.#messages = messages.slice(from, to);
		this.#messages.forEach((message) => {
			message.authors.forEach((author) => this.#authorSet.add(author));
			message.body.forEach((symbol) => {
				this.#symbolMap.set(symbol.text, symbol);
				this.#authorMap.set(symbol.text, message.authors);
			});
		});
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

	filterSymbolsByMinimumCount(minimum) {
		this.#symbolMap.filter((key, value) => value.tally > minimum);
		this.#interMessageSymbolEdgeMap.filter((key, value) =>
			this.#edgeFilter(value)
		);
		this.#allSymbolEdgeMap.filter((key, value) => this.#edgeFilter(value));
		this.#authorMap.filter((key) => this.#symbolMap.has(key));
		return this;
	}

	#edgeFilter(edge) {
		return this.#symbolMap.has(edge.aId) && this.#symbolMap.has(edge.bId);
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
