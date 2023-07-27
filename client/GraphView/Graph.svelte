<script>
	import Animation from './Animation.svelte';
	import TextSvg from './TextSvg.svelte';
	import TextSprite from './textSprite';
	import ForceDirectedGraph from './forceDirectedGraph';
	import TalliedMap from './talliedMap';
	import Rotation from './rotation';

	export let messages = [];

	const interval = 41.6666666667 * 3;
	const sampleSize = 100;
	const height = 200;
	const width = 300;
	const attraction = 0.1;
	const fdg = new ForceDirectedGraph({
		diameter: height / 2,
	});
	const edgeIdSeparator = '_';
	const spriteMap = new TalliedMap();
	const attractingEdgeMap = new TalliedMap();
	const repellingEdgeMap = new TalliedMap();

	function toSprite(symbol) {
		const sprite = new TextSprite({
			text: symbol.text,
		});
		sprite.id = symbol.text;
		sprite.type = TextSvg;
		sprite.class = 'symbol';
		spriteMap.set(sprite.id, sprite);
		return sprite;
	}

	function setEdges(sprites, edgeMap) {
		sprites.forEach((a) => {
			sprites.forEach((b) => {
				if (a.id !== b.id)
					edgeMap.set(`${a.id}${edgeIdSeparator}${b.id}`, {
						a: spriteMap.get(a.id),
						b: spriteMap.get(b.id),
					});
			});
		});
	}

	messages.splice(0, sampleSize).forEach((message) => {
		const sprites = message.body.map((symbol) => toSprite(symbol));
		setEdges(sprites, attractingEdgeMap);
	});

	const sprites = spriteMap.values;
	const rotate = new Rotation();

	sprites.forEach((sprite) => {
		sprite.fontSize += sprite.tally;
		sprite.addTransformation(() => rotate.y(sprite, 1));
	});

	setEdges(sprites, repellingEdgeMap);
	repellingEdgeMap.values.forEach((edge) => {
		const { a, b } = edge;
		a.addTransformation(() => fdg.curvedRepulse(a, b));
	});

	attractingEdgeMap.values.forEach((edge) => {
		const { a, b } = edge;
		a.addTransformation(() => fdg.attract(a, b, attraction));
	});

	fdg.distributeAboutCentre(sprites);
</script>

<Animation {width} {height} {sprites} {interval} />
