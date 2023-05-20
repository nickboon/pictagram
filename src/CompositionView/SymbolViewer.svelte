<script>
	import { blocks } from './unicodeBlock';
	import SymbolEntity from './SymbolEntity.svelte';
	import Symbol from '../Message/Symbol.svelte';
	import Button from '../Util/Button.svelte';
	import SymbolObject from '../Message/symbol.js';
	import Message from '../Message/message';

	export let message = new Message();
	export let viewed;

	function shuffle(unshuffled) {
		return unshuffled
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	}

	function onSymbolClick(event) {
		message.body = [...message.body, new SymbolObject(event.target.innerText)];
	}

	function onMouseenter(event) {
		viewed = event.target.innerText;
	}

	function onMouseleave() {
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
			<Symbol><SymbolEntity {code} /></Symbol>
		</Button>
	{/each}
</div>

<style>
	div {
		margin: 2rem 0;
		max-height: 8rem;
		overflow-y: scroll;
		scrollbar-color: transparent;
	}
</style>
