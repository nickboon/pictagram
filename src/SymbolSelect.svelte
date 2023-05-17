<script>
	import { blocks } from './unicodeBlock';
	import Symbol from './Symbol.svelte';
	import Button from './Button.svelte';
	import Message from './message';

	export let message = new Message();
	export let viewed;

	function createSymbol(
		text,
		fontSize = 24,
		x = 0,
		y = 0,
		scaleX = 1,
		scaleY = 1,
		angle = 0,
		opacity = 1
	) {
		return { text, fontSize, x, y, scaleX, scaleY, angle, opacity };
	}

	function shuffle(unshuffled) {
		return unshuffled
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	}

	function onSymbolClick(event) {
		message.symbols = [
			...message.symbols,
			createSymbol(event.target.innerText),
		];
	}

	function onMouseenter(event) {
		viewed = event.target.innerText;
	}

	function onMouseleave(event) {
		viewed = false;
	}

	const codes = shuffle(blocks.map((block) => block.codes).flat());
</script>

<div>
	{#each codes as code}
		<Button
			on:click={onSymbolClick}
			on:mouseenter={onMouseenter}
			on:mouseleave={onMouseleave}
		>
			<Symbol {code} />
		</Button>
	{/each}
</div>

<style>
	div {
		margin: 2rem 0;
		max-height: 4rem;
		overflow-y: scroll;
		scrollbar-color: transparent;
	}
</style>
