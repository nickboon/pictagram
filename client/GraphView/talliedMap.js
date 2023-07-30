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

	get values() {
		return [...this.#map.values()];
	}
}