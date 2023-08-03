import TextSvg from './TextSvg.svelte';
import LineSvg from './LineSvg.svelte';
import TextSprite from './textSprite';
import LineSprite from './lineSprite';
import TalliedMap from './talliedMap';
import Rotation from './rotation';
import ForceDirectedGraph from './forceDirectedGraph';

const edgeIdSeparator = '_';
const attractingEdgeMap = new TalliedMap();
const repellingEdgeMap = new TalliedMap();
const spriteMap = new TalliedMap();
const rotateAbout = new Rotation();

function toEdgeId(a, b) {
	return `${a.id}${edgeIdSeparator}${b.id}`;
}

function toTextSprite(symbol) {
	const sprite = new TextSprite({
		text: symbol.text,
		offset: TextSprite.offset.fromCentre,
	});
	sprite.id = symbol.text;
	sprite.type = TextSvg;
	sprite.class = 'symbol';
	spriteMap.set(sprite.id, sprite);
	return sprite;
}

function toLineSprite(a, b, edgeOpacity) {
	const sprite = new LineSprite(a, b);
	sprite.id = toEdgeId(a, b);
	sprite.type = LineSvg;
	sprite.opacity = edgeOpacity;
	return sprite;
}

function setEdges(sprites, edgeMap) {
	sprites.flatMap((a, i) =>
		sprites.slice(i + 1).forEach((b) =>
			edgeMap.set(toEdgeId(a, b), {
				aId: a.id,
				bId: b.id,
			})
		)
	);
}

function buildEdgesFromMessageSymbols(messages, from, to) {
	messages.slice(from, to).forEach((message) => {
		const sprites = message.body.map((symbol) => toTextSprite(symbol));
		setEdges(sprites, attractingEdgeMap);
	});
}

function filterSymbolsByCount(minimum) {
	return spriteMap.values.filter((sprite) => sprite.tally > minimum);
}

export default class MessageGraph {
	build({
		messages,
		from,
		to,
		minimumSymbolCount,
		rotate,
		attraction,
		edgeOpacity,
		height,
	} = {}) {
		const fdg = new ForceDirectedGraph({
			diameter: height / 2,
		});

		if (!messages) return [];

		buildEdgesFromMessageSymbols(messages, from, to);
		const sprites = filterSymbolsByCount(minimumSymbolCount);

		sprites.forEach((sprite) => {
			sprite.fontSize += sprite.tally;
			if (rotate) sprite.addTransformation(() => rotateAbout.y(sprite, 1));
		});

		setEdges(sprites, repellingEdgeMap);
		repellingEdgeMap.values.forEach((edge) => {
			const a = spriteMap.get(edge.aId);
			const b = spriteMap.get(edge.bId);
			a.addTransformation(() => fdg.curvedRepulse(a, b));
		});

		fdg.distributeAboutCentre(sprites);

		attractingEdgeMap.values
			.filter(
				(edge) =>
					sprites.some((sprite) => sprite.id === edge.aId) &&
					sprites.some((sprite) => sprite.id === edge.bId)
			)
			.forEach((edge) => {
				const a = spriteMap.get(edge.aId);
				const b = spriteMap.get(edge.bId);
				a.addTransformation(() => fdg.attract(a, b, attraction));
				sprites.push(toLineSprite(a, b, edgeOpacity));
			});

		return sprites;
	}
}
