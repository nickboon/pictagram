export default class Perspective {
	#fl;
	#vpx;
	#vpy;
	#maxOpacity;
	#vanishingDistance;
	#getScale = function (point) {
		const fl = this.#fl;
		return fl / (fl + point.z);
	};
	#getAtmosphericOpacity = function (z) {
		var range = z + this.#fl;
		return (1 - range / this.#vanishingDistance) * this.#maxOpacity;
	};

	constructor({
		focalLength = 350,
		vanishingPointX = window.screen.width / 2,
		vanishingPointY = window.screen.height / 2,
		vanishingDistance = 1000,
		maxOpacity = 1,
	} = {}) {
		this.#fl = focalLength;
		this.#vpx = vanishingPointX;
		this.#vpy = vanishingPointY;
		this.#vanishingDistance = vanishingDistance;
		this.#maxOpacity = maxOpacity;
	}

	toScreen(sprite) {
		const scale = this.#getScale(sprite);
		return {
			x: this.#vpx + sprite.x * scale,
			y: this.#vpy + sprite.y * scale,
			scale,
			opacity: this.#getAtmosphericOpacity(sprite.z) * sprite.opacity,
		};
	}

	isBehindViewer(z) {
		return z < -this.#fl;
	}
}
