export default class LineSprite {
	constructor(a, b, opacity = 1) {
		this.a = a;
		this.b = b;
		this.opacity = opacity;
	}

	transform() {
		return Object.values(this);
	}
}
