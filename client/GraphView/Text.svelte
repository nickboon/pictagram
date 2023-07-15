<script>
	import Text from './text';

	export let state = { x: 0, y: 0, scale: 1, alpha: 1 };
	export let fontSize = Text.default.size;

	let className = '';
	export { className as class };

	let { x, y, scale, alpha } = state;
</script>

<text
	{x}
	{y}
	opacity={alpha}
	font-size="{fontSize}pt"
	transform="scale({scale})"
	class={className}
>
	<slot />
</text>
