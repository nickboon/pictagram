import chroma from 'chroma-js';
import SymbolGraph from './symbolGraph';

export default class ColouredSymbolGraph extends SymbolGraph {
	#colourMap = new Map();

	constructor(brighten = 1, darken = 1) {
		super();
		this.brightenIncrement = brighten;
		this.darkenIncrement = darken;
	}

	setSpriteColours() {
		const colours = chroma
			.scale(['red', 'green', 'blue'])
			.mode('hsl')
			.correctLightness()
			.colors(super.authorSet.size);

		[...super.authorSet].forEach((author, index) =>
			this.#colourMap.set(author, colours[index])
		);

		console.log('colourMap: ', this.#colourMap);
	}

	getColour(spriteId) {
		const authorSet = super.authorMap.get(spriteId);
		const colours = [...authorSet].map((author) => this.#colourMap.get(author));
		return chroma
			.average(colours, 'hsl')
			.brighten(authorSet.size * this.brightenIncrement - this.darkenIncrement);
	}
}
