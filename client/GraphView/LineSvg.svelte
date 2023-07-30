<script>
	export let x1 = 0;
	export let x2 = 0;
	export let y1 = 0;
	export let y2 = 0;
	export let stroke = 'black';
	export let width = 0.5;
	export let opacity = undefined;

	let className;
	export { className as class };

	export function init(sprite) {
		opacity = sprite.opacity;
	}

	export function update(points) {
		const a = points[0];
		const b = points[1];
		x1 = a.x;
		y1 = a.y;
		x2 = b.x;
		y2 = b.y;
		opacity = opacity || (a.z < b.z ? a : b).opacity;
	}
</script>

<line
	{x1}
	{y1}
	{x2}
	{y2}
	{stroke}
	stroke-width={width}
	stroke-opacity={opacity}
	class={className}
/>
