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
	export let cover = 0.8;
	export let width = document.documentElement.clientWidth * cover;
	export let height = document.documentElement.clientHeight * cover;

	export let from = 0;
	export let to = 100;
	export let attraction = 0.02;
	export let minimumSymbolCount = 0;
	export let edgeOpacity = 0.4;
	export let brighten = 0.6;

	let fdg = new ForceDirectedGraph({ diameter: height / 2 });
	function restart() {
		width = document.documentElement.clientWidth * cover;
		height = document.documentElement.clientHeight * cover;
		fdg = new ForceDirectedGraph({ diameter: height / 2 });
		messages = messages;
	}

	let isControlsOpen = false;
	function onKeyDown(event) {
		if (event.key === 'o') {
			isControlsOpen = !isControlsOpen;
			restart();
		}
	}

	const symbolGraph = new ColouredSymbolGraph(brighten);
	const symbolClassName = 'symbol';
	const rotateAbout = new Rotation();

	function transformAll(sprites) {
		sprites.forEach((sprite) => {
			sprite.addTransformation(() => rotateAbout.y(sprite, 1));
			sprite.addTransformation(() => fdg.attractToCenter(sprite, attraction));
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

{#if isControlsOpen}
	<section class="controls">
		<input
			type="range"
			bind:value={cover}
			min="0.6"
			max="1"
			step="0.01"
		/>{cover}
		<button on:click={restart}>Apply</button>
	</section>
{/if}
<section>
	<Animation {width} {height} {sprites} {interval} />
</section>

<svelte:window on:keydown={onKeyDown} />

<style>
	section {
		align-items: center;
		background-color: black;
		display: flex;
		height: 100%;
		justify-content: center;
	}

	.controls {
		background-color: white;
		color: black;
		height: 20%;
	}
</style>
