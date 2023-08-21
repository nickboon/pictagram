<script>
	import TextSprite from './textSprite';

	export let text = undefined;
	export let x = 0;
	export let y = 0;
	export let opacity = 1;
	export let scale = 1;
	export let fontSize = TextSprite.default.size;
	export let textAnchor = undefined;
	export let fill = 'black';

	let yOffset = 0;
	let className;
	export { className as class };

	const textAnchors = {
		middle: 'middle',
	};

	export function init(sprite) {
		text = sprite.text;
		fontSize = sprite.fontSize || fontSize;
		fill = sprite.fill;
		if (sprite.offset === TextSprite.offset.fromCentre) {
			textAnchor = textAnchors.middle;
			yOffset = fontSize / 2;
		}
	}

	export function update(points) {
		const point = points[0];
		x = point.x;
		y = point.y;
		scale = point.scale;
		opacity = point.opacity;
	}
</script>

<text
	{fill}
	{opacity}
	font-size="{fontSize}px"
	transform="translate({x},{y + yOffset}) scale({scale})"
	class={className}
	text-anchor="middle"
>
	{text}
</text>

<style>
	text {
		stroke: none;
	}
</style>
