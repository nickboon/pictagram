import Perspective from './perspective';

export default class Text {
	static get default() {
		return {
			size: 16,
		};
	}

	#size;
	#text;
	#alpha;
	#perspective;
	#useAtmosphericPerspective;
	get #point() {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
		};
	}

	constructor({
		x = 0,
		y = 0,
		z = 0,
		size = Text.default.size,
		text,
		alpha = 1,
		perspective = new Perspective(),
		useAtmosphericPerspective = false,
	} = {}) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.#size = size;
		this.#text = text;
		this.#alpha = alpha;
		this.#perspective = perspective;
		this.#useAtmosphericPerspective = useAtmosphericPerspective;
	}

	get size() {
		return this.#size;
	}

	get text() {
		return this.#text;
	}

	toScreen() {
		const { x, y, scale, atmosphericAlpha } = this.#perspective.toScreen(
			this.#point
		);
		const alpha = this.#useAtmosphericPerspective
			? this.#alpha * atmosphericAlpha
			: this.#alpha;
		return { x, y, scale, alpha };
	}
}
