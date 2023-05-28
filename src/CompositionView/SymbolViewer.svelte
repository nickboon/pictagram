<script>
	import { blocks } from './unicodeBlock';
	import SymbolEntity from './SymbolEntity.svelte';
	import Symbol from '../Message/Symbol.svelte';
	import Button from '../Util/Button.svelte';
	import SymbolObject from '../Message/symbol.js';
	import Message from '../Message/message';

	export let message = new Message();
	export let viewed;

	const sortedCodes = blocks.map((block) => block.codes).flat();
	let codes;

	function shuffle(unshuffled) {
		return unshuffled
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	}

	function shuffleCodes() {
		codes = shuffle(sortedCodes);
	}

	function sortCodes() {
		codes = sortedCodes;
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

	shuffleCodes();
</script>

<section>
	<div class="order">
		<Button on:click={shuffleCodes}><Symbol>🔀︎</Symbol></Button>
		<Button on:click={sortCodes}><Symbol>⇅︎</Symbol></Button>
	</div>
	<div class="index">
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
</section>

<style>
	section {
		margin: 2rem 0;
		text-align: center;
	}

	.order {
		visibility: hidden;
		margin-bottom: 1rem;
	}

	section:hover .order {
		visibility: visible;
	}

	.index {
		max-height: 8rem;
		overflow-y: scroll;
		scrollbar-color: transparent;
	}
</style>
