<script>
	import { onMount } from 'svelte';

	export let sprites = [];
	export let interval = 1000; //41.6666666667; // 24 fps
	export let background = 'white';
	export let width = 0;
	export let height = 0;

	const spriteSvgs = {};

	function update() {
		sprites.forEach((sprite) => {
			const state = sprite.getState();
			spriteSvgs[sprite.id].update(state);
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
	id="animation"
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {height}"
	style="background-color: {background};"
>
	{#each sprites as sprite, index (sprite.id)}
		<svelte:component
			this={sprite.type}
			class={sprite.class}
			state={sprite.state}
			bind:this={spriteSvgs[sprite.id]}
		>
			{sprite.text}
		</svelte:component>
	{/each}
</svg>
