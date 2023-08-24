<script>
	import Animation from './Animation.svelte';
	import ColouredSymbolGraph from './colouredSymbolGraph';

	import Rotation from './rotation';
	import TextSvg from './TextSvg.svelte';
	import LineSvg from './LineSvg.svelte';
	import TextSprite from './textSprite';
	import LineSprite from './lineSprite';
	import ForceDirectedGraph from './forceDirectedGraph';

	export let messages = [];
	export let interval = 41.6666666667 * 3;
	export let height = 200;
	export let width = 300;

	export let from = 0;
	export let to = 100;
	export let attraction = 0.02;
	export let minimumSymbolCount = 0;
	export let edgeOpacity = 0.4;
	export let brighten = 0.6;

	const symbolGraph = new ColouredSymbolGraph(brighten);
	const symbolClassName = 'symbol';
	const fdg = new ForceDirectedGraph({ diameter: height / 2 });
	const rotateAbout = new Rotation();

	function transformAll(sprites) {
		sprites.forEach((sprite) => {
			sprite.addTransformation(() => rotateAbout.y(sprite, 1));
			// sprite.addTransformation(() => fdg.attractToCenter(sprite, attraction));
		});
	}

	function toTextSprite(symbol) {
		const sprite = new TextSprite({
			text: symbol.text,
			offset: TextSprite.offset.fromCentre,
		});
		sprite.id = symbol.text;
		sprite.fontSize += symbol.tally;
		sprite.class = symbolClassName;
		sprite.type = TextSvg;
		sprite.fill = symbolGraph.getColour(sprite.id);

		return sprite;
	}

	function toLineSprite(a, b, edgeOpacity) {
		const sprite = new LineSprite(a, b);
		sprite.id = ColouredSymbolGraph.toEdgeId(a.id, b.id);
		sprite.opacity = edgeOpacity;
		sprite.type = LineSvg;

		return sprite;
	}

	function toTextSpriteMap(symbolMap) {
		const textSpriteMap = {};
		symbolMap.keys.forEach((key) => {
			textSpriteMap[key] = toTextSprite(symbolMap.get(key));
		});
		return textSpriteMap;
	}

	function buildSprites({
		messages,
		from,
		to,
		minimumSymbolCount,
		attraction,
		edgeOpacity,
	}) {
		symbolGraph
			.clear()
			.setMessages(messages, from, to)
			.setInterMessageSymbolEdges()
			.setAllSymbolEdges()
			.filterSymbolsByMinimumCount(minimumSymbolCount);

		symbolGraph.setSpriteColours();

		const textSpriteMap = toTextSpriteMap(symbolGraph.symbolMap);
		symbolGraph.symbolEdgeMap.values.forEach((edge) => {
			const a = textSpriteMap[edge.aId];
			const b = textSpriteMap[edge.bId];
			a.addTransformation(() => fdg.curvedRepulse(a, b));
		});

		const lineSprites = [];
		symbolGraph.interMessageSymbolEdgeMap.values.forEach((edge) => {
			const a = textSpriteMap[edge.aId];
			const b = textSpriteMap[edge.bId];
			a.addTransformation(() => fdg.attract(a, b, attraction));
			lineSprites.push(toLineSprite(a, b, edgeOpacity));
		});

		const textSprites = Object.values(textSpriteMap);
		transformAll(textSprites);

		const sprites = [...textSprites, ...lineSprites];
		fdg.distributeAboutCentre(sprites);

		return sprites;
	}

	$: sprites = buildSprites({
		messages,
		from,
		to,
		minimumSymbolCount,
		attraction,
		edgeOpacity,
	});
</script>

<Animation {width} {height} {sprites} {interval} />
