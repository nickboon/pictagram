<script>
	import Animation from './Animation.svelte';
	import TextSvg from './TextSvg.svelte';
	import LineSvg from './LineSvg.svelte';
	import TextSprite from './textSprite';
	import LineSprite from './lineSprite';
	import ForceDirectedGraph from './forceDirectedGraph';
	import TalliedMap from './talliedMap';
	import Rotation from './rotation';

	export let messages = [];
	export let interval = 41.6666666667 * 3;
	export let sampleSize = 100;
	export let height = 200;
	export let width = 300;
	export let attraction = 0.01;
	export let tallyMinimum = 0;
	export let edgeOpacity = 0.4;
	export let rotate = true;

	const edgeIdSeparator = '_';
	const attractingEdgeMap = new TalliedMap();
	const repellingEdgeMap = new TalliedMap();
	const spriteMap = new TalliedMap();
	const rotateAbout = new Rotation();
	const fdg = new ForceDirectedGraph({
		diameter: height / 2,
	});

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

	function toLineSprite(a, b) {
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

	messages.splice(0, sampleSize).forEach((message) => {
		const sprites = message.body.map((symbol) => toTextSprite(symbol));
		setEdges(sprites, attractingEdgeMap);
	});

	const sprites = spriteMap.values.filter(
		(sprite) => sprite.tally > tallyMinimum
	);

	sprites.forEach((sprite) => {
		sprite.fontSize += sprite.tally;
		if (rotate) sprite.addTransformation(() => rotateAbout.y(sprite, 1));
	});
	fdg.distributeAboutCentre(sprites);

	setEdges(sprites, repellingEdgeMap);
	repellingEdgeMap.values.forEach((edge) => {
		const a = spriteMap.get(edge.aId);
		const b = spriteMap.get(edge.bId);
		a.addTransformation(() => fdg.curvedRepulse(a, b));
	});

	attractingEdgeMap.values.forEach((edge) => {
		const a = spriteMap.get(edge.aId);
		const b = spriteMap.get(edge.bId);
		a.addTransformation(() => fdg.attract(a, b, attraction));
		sprites.push(toLineSprite(a, b));
	});
</script>

<Animation {width} {height} {sprites} {interval} />
