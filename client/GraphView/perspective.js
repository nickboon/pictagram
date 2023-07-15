export default class Perspective {
	#fl;
	#vpx;
	#vpy;
	#maxAlpha;
	#vanishingDistance;
	#getScale = function (point) {
		const fl = this.#fl;
		return fl / (fl + point.z);
	};
	#getAtmosphericAlpha = function (z) {
		var range = z + this.#fl;
		return (1 - range / this.#vanishingDistance) * this.#maxAlpha;
	};

	constructor({
		focalLength = 350,
		vanishingPointX = window.screen.width / 2,
		vanishingPointY = window.screen.height / 2,
		vanishingDistance = 1000,
		maxAlpha = 1,
	} = {}) {
		this.#fl = focalLength;
		this.#vpx = vanishingPointX;
		this.#vpy = vanishingPointY;
		this.#vanishingDistance = vanishingDistance;
		this.#maxAlpha = maxAlpha;
	}

	toScreen(point) {
		const scale = this.#getScale(point);
		return {
			x: this.#vpx + point.x * scale,
			y: this.#vpy + point.y * scale,
			scale,
			alpha: this.#getAtmosphericAlpha(point.z),
		};
	}

	isBehindViewer(z) {
		return z < -this.#fl;
	}
}
