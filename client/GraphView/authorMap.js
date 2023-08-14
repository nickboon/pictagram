export default class SymbolAuthorMap {
	#map = new Map();

	set(symbol, authors) {
		if (!this.#map.has(symbol)) this.#map.set(symbol, new Set());

		authors.forEach((author) => {
			this.#map.get(symbol).add(author);
		});
	}

	get(symbol) {
		return this.#map.get(symbol);
	}

	filter(predicate) {
		this.#map.forEach((value, key) => {
			if (!predicate(key, value)) this.#map.delete(key);
		});
	}
}
