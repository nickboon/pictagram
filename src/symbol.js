export default class Symbol {
	constructor(
		text,
		fontSize = 24,
		x = 0,
		y = 0,
		scaleX = 1,
		scaleY = 1,
		angle = 0,
		opacity = 1
	) {
		this.text = text;
		this.fontSize = fontSize;
		this.x = x;
		this.y = y;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.angle = angle;
		this.opacity = opacity;
	}
}
