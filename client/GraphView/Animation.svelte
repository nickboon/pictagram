<script>
	import { onMount } from 'svelte';
	import Perspective from './perspective';

	export let sprites = [];
	export let interval = 41.6666666667; // 24 fps
	export let background = 'white';
	export let width = 0;
	export let height = 0;

	const spriteSvgs = {};
	const useAtmosphericPerspective = false;
	const perspective = new Perspective({
		vanishingPointY: height / 2,
		vanishingPointX: width / 2,
	});

	function toScreen(state) {
		const { x, y, scale, atmosphericAlpha } = perspective.toScreen(state);
		const opacity = useAtmosphericPerspective
			? state.opacity * atmosphericAlpha
			: state.opacity;
		return { x, y, scale, opacity };
	}

	function update() {
		sprites.sort((a, b) => a.z - b.z);
		sprites.forEach((sprite) => {
			const updated = sprite.transform();
			const projection = toScreen(updated);
			spriteSvgs[sprite.id].update(projection);
		});
	}

	function restart() {
		setInterval(update, interval);
	}

	function init() {
		sprites.forEach((sprite) => {
			const projection = { ...sprite, ...toScreen(sprite) };
			spriteSvgs[sprite.id].init(projection);
		});
		restart();
	}

	onMount(init);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {height}"
	style="background-color: {background};"
>
	{#each sprites as sprite, index (sprite.id)}
		<svelte:component
			this={sprite.type}
			class={sprite.class}
			bind:this={spriteSvgs[sprite.id]}
		/>
	{/each}
</svg>
