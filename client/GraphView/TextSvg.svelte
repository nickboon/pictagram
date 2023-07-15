<script>
	import TextSprite from './textSprite';

	export let text = undefined;
	export let x = 0;
	export let y = 0;
	export let opacity = 1;
	export let scale = 1;
	export let fontSize = TextSprite.default.size;

	let className = '';
	export { className as class };

	export function init(state) {
		text = state.text;
		x = state.x;
		y = state.y;
		scale = state.scale;
		opacity = state.opacity;
		fontSize = state.fontSize || fontSize;
	}

	export function update(state) {
		x = state.x;
		y = state.y;
		scale = state.scale;
		opacity = state.opacity;
	}
</script>

<text
	{x}
	{y}
	{opacity}
	font-size="{fontSize}pt"
	transform="scale({scale})"
	class={className}
>
	{text}
</text>
