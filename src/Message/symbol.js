export default class Symbol {
	static default = {
		fontSize: 24,
	};
	constructor({
		text,
		fontSize = Symbol.default.fontSize,
		x = 0,
		y = 0,
		offsetLeft = 0,
		offsetTop = 0,
		scaleX = 1,
		scaleY = 1,
		angle = 0,
		opacity = 1,
		isInverted = false,
	} = {}) {
		this.text = text;
		this.fontSize = fontSize;
		this.x = x;
		this.y = y;
		this.offsetLeft = offsetLeft;
		this.offsetTop = offsetTop;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.angle = angle;
		this.opacity = opacity;
		this.isInverted = isInverted;
	}
}
