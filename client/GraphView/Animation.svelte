<script>
	import { onMount } from 'svelte';

	export let sprites = [];
	export let interval = 1000; //41.6666666667; // 24 fps
	export let background = 'white';
	export let width = 0;
	export let height = 0;
	export let is3d = true;

	const spriteSvgs = {};

	function update() {
		if (is3d) sprites.sort((a, b) => a.z - b.z);
		sprites.forEach((sprite) => {
			const state = sprite.getState();
			spriteSvgs[sprite.id].update(state);
		});
	}

	function restart() {
		setInterval(update, interval);
	}

	function init() {
		sprites.forEach((sprite) => {
			const state = sprite.getInitState();
			spriteSvgs[sprite.id].init(state);
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
