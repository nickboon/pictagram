<script>
	import Animation from './Animation.svelte';
	import MessageGraph from './messageGraph';

	export let messages = [];
	export let interval = 41.6666666667 * 3;
	export let height = 200;
	export let width = 300;

	export let from = 0;
	export let to = 100;
	export let attraction = 0.01;
	export let minimumSymbolCount = 0;
	export let edgeOpacity = 0.4;
	export let rotate = true;

	const messageGraph = new MessageGraph();
	$: sprites = messageGraph.build({
		messages,
		from,
		to,
		minimumSymbolCount,
		rotate,
		attraction,
		edgeOpacity,
		height,
	});
</script>

<Animation {width} {height} {sprites} {interval} />
