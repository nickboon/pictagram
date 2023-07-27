export default class ForceDirectedGraph {
	#diameter;

	static get default() {
		return {
			diameter: window.innerHeight * 0.5,
			attraction: 0.01,
		};
	}

	static #getD(dx, dy, dz) {
		return Math.pow(
			Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2) * 1.0,
			0.5
		);
	}

	constructor({ diameter = ForceDirectedGraph.default.diameter, nodes } = {}) {
		this.#diameter = diameter;
		if (nodes) this.distributeAboutCentre(nodes);
	}

	distributeAboutCentre(nodes) {
		const angleIncrement = (Math.PI * 2) / nodes.length;
		const zIncrement = this.#diameter / nodes.length;
		let angle = 0;
		nodes.forEach((node, i) => {
			node.x = Math.sin(angle);
			node.y = Math.cos(angle);
			node.z += zIncrement * (i + 1) - this.#diameter / 2;
			angle += angleIncrement * (i + 1);
		});
	}

	attract(a, b, attraction = ForceDirectedGraph.default.attraction) {
		const dx = (a.x - b.x) * attraction;
		const dy = (a.y - b.y) * attraction;
		const dz = (a.z - b.z) * attraction;
		a.x -= dx;
		a.y -= dy;
		a.z -= dz;
		b.x += dx;
		b.y += dy;
		b.z += dz;
	}

	curvedRepulse(a, b) {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const dz = a.z - b.z;
		const dist = ForceDirectedGraph.#getD(dx, dy, dz);
		if (dist === 0) return; // no vector in this case and guarding divide by zero.

		const inverseDist = 1 / dist;
		const accel = (dist - this.#diameter) / this.#diameter;
		const repulsion = inverseDist * accel;
		const xRepulsion = dx * repulsion;
		const yRepulsion = dy * repulsion;
		const zRepulsion = dz * repulsion;

		a.x -= xRepulsion;
		a.y -= yRepulsion;
		a.z -= zRepulsion;
		b.x += xRepulsion;
		b.y += yRepulsion;
		b.z += zRepulsion;
	}
}
