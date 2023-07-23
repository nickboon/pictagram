import Sprite from './sprite';

export default class TextSprite extends Sprite {
	static get default() {
		return {
			fontSize: 6,
		};
	}

	constructor({
		x,
		y,
		z,
		opacity,
		text,
		fontSize = TextSprite.default.fontSize,
	} = {}) {
		super({ x, y, z, opacity });
		this.fontSize = fontSize;
		this.text = text;
	}
}
