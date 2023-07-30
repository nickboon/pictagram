import SinglePointSprite from './sprite';

export default class TextSprite extends SinglePointSprite {
	static get offset() {
		return {
			none: 'none',
			fromCentre: 'fromCentre',
		};
	}

	static get default() {
		return {
			fontSize: 6,
			offset: TextSprite.offset.none,
		};
	}

	constructor({
		x,
		y,
		z,
		opacity,
		text,
		fontSize = TextSprite.default.fontSize,
		offset = TextSprite.default.offset,
	} = {}) {
		super({ x, y, z, opacity });
		this.fontSize = fontSize;
		this.text = text;
		this.offset = offset;
	}
}
