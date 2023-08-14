export default class TalliedMap {
	#map = new Map();

	set(key, value = {}) {
		if (this.#map.has(key)) {
			this.#map.get(key).tally++;
			return;
		}
		value.tally = 1;
		this.#map.set(key, value);
	}

	get(key) {
		return this.#map.get(key);
	}

	has(key) {
		return this.#map.has(key);
	}

	get values() {
		return [...this.#map.values()];
	}

	get keys() {
		return [...this.#map.keys()];
	}

	filter(predicate) {
		this.#map.forEach((value, key) => {
			if (!predicate(key, value)) this.#map.delete(key);
		});
	}
}
