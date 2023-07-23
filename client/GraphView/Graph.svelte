<script>
	import Animation from './Animation.svelte';
	import TextSvg from './TextSvg.svelte';
	import TextSprite from './textSprite';
	import ForceDirectedGraph from './forceDirectedGraph';
	import TalliedMap from './talliedMap';

	export let messages = [];

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

	function setEdges(sprites, edgeSet) {
		sprites.forEach((a) => {
			sprites.forEach((b) => {
				if (a.id !== b.id)
					edgeSet.set(`${a.id}${edgeIdSeparator}${b.id}`, {
						a: spriteMap.get(a.id),
						b: spriteMap.get(b.id),
					});
			});
		});
	}

	messages.forEach((message) => {
		const sprites = message.body.map((symbol) => toSprite(symbol));
		setEdges(sprites, attractingEdgeMap);
	});

	const sprites = spriteMap.values;
	sprites.forEach((sprite) => {
		sprite.fontSize += sprite.tally;
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

<Animation {width} {height} {sprites} />
