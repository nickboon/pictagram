export default class TextSprite {
	static get default() {
		return {
			size: 16,
		};
	}

	#size;
	#text;
	#opacity;

	constructor({
		x = 0,
		y = 0,
		z = 0,
		size = TextSprite.default.size,
		text,
		opacity = 1,
	} = {}) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.#size = size;
		this.#text = text;
		this.#opacity = opacity;
	}

	get size() {
		return this.#size;
	}

	get text() {
		return this.#text;
	}

	get opacity() {
		return this.#opacity;
	}
}
