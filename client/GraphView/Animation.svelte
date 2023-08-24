<script>
	import { onMount } from 'svelte';
	import Perspective from './perspective';

	export let sprites = [];
	export let interval = 41.6666666667; // 24 fps
	export let x = 0;
	export let y = 0;
	export let width = 0;
	export let height = 0;

	const spriteSvgs = {};
	const useAtmosphericPerspective = false;
	const perspective = new Perspective({
		vanishingPointY: height / 2,
		vanishingPointX: width / 2,
	});

	function toScreen(states) {
		return states.map((state) => {
			const { x, y, scale, atmosphericAlpha } = perspective.toScreen(state);
			const opacity = useAtmosphericPerspective
				? state.opacity * atmosphericAlpha
				: state.opacity;
			return { x, y, scale, opacity };
		});
	}

	function update() {
		sprites.sort((a, b) => a.z - b.z);
		sprites.forEach(async (sprite) => {
			spriteSvgs[sprite.id].init(sprite); // need to initialize sprites introduced since load.
			const updatedStates = sprite.transform();
			const projection = toScreen(updatedStates);
			spriteSvgs[sprite.id].update(projection);
		});
	}

	function restart() {
		setInterval(update, interval);
	}

	function init() {
		update();
		restart();
	}

	onMount(init);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{width}
	{height}
	viewBox="{x} {y} {width} {height}"
>
	{#each sprites as sprite, index (sprite.id)}
		<svelte:component
			this={sprite.type}
			class={sprite.class}
			bind:this={spriteSvgs[sprite.id]}
		/>
	{/each}
</svg>

<style>
	svg {
		background-color: black;
		fill: white;
		overflow: visible;
		stroke: white;
	}
</style>
