class Transformation {
	#run;

	constructor(run = () => {}) {
		this.#run = run;
	}

	run() {
		this.#run();
	}
}

export default class SinglePointSprite {
	#transformations = [];

	constructor({ x = 0, y = 0, z = 0, opacity = 1 } = {}) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.opacity = opacity;
	}

	get transformations() {
		return this.#transformations;
	}

	addTransformation(transformation) {
		this.#transformations.push(new Transformation(transformation));
	}

	transform() {
		this.#transformations.forEach((transformation) => transformation.run());
		return [this];
	}
}
