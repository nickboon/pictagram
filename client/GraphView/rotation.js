export default class Rotation {
	#angles = [];

	constructor(numberOfIncrements = 360) {
		const maxAngle = Math.PI * 2;
		const increment = maxAngle / numberOfIncrements;
		for (let angle = 0; angle < maxAngle - 1; angle += increment) {
			this.#angles.push({
				sin: Math.sin(angle),
				cos: Math.cos(angle),
			});
		}
	}

	x(point, numberOfIncrements) {
		const cosX = this.#angles[numberOfIncrements].cos;
		const sinX = this.#angles[numberOfIncrements].sin;
		point.y = point.y * cosX - point.z * sinX;
		point.z = point.z * cosX + point.y * sinX;
		return point;
	}

	y(point, numberOfIncrements) {
		const cosY = this.#angles[numberOfIncrements].cos;
		const sinY = this.#angles[numberOfIncrements].sin;
		point.x = point.x * cosY - point.z * sinY;
		point.z = point.z * cosY + point.x * sinY;
		return point;
	}

	z(point, numberOfIncrements) {
		const cosZ = this.#angles[numberOfIncrements].cos;
		const sinZ = this.#angles[numberOfIncrements].sin;
		point.x = point.x * cosZ - point.y * sinZ;
		point.y = point.y * cosZ + point.x * sinZ;
		return point;
	}
}
