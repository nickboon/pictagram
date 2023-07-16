import Sprite from './sprite';

export default class TextSprite extends Sprite {
	static get default() {
		return {
			size: 16,
		};
	}

	constructor({ x, y, z, opacity, text, size = TextSprite.default.size } = {}) {
		super({ x, y, z, opacity });
		this.size = size;
		this.text = text;
	}
}
