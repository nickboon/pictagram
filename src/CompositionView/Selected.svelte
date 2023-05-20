<script>
	import Symbol from '../Symbol.svelte';
	import Button from '../Util/Button.svelte';

	export let message;
	export let highlight;
	export let selected;

	function setSelected(index) {
		selected = index;
		message.symbols.map((symbol) => (symbol.isSelected = false));
		message.symbols[index].isSelected = true;
	}

	function onMouseenter(index) {
		highlight = index;
	}

	function onMouseleave() {
		highlight = false;
	}

	function onChange(messageLength) {
		if (messageLength) setSelected(messageLength - 1);
	}
	$: onChange(message.symbols.length);
</script>

<ul>
	{#each message.symbols as symbol, index}
		<li>
			<Button
				selected={symbol.isSelected}
				on:click={() => {
					setSelected(index);
				}}
				on:mouseenter={() => {
					onMouseenter(index);
				}}
				on:mouseleave={onMouseleave}
			>
				<Symbol>{symbol.text}</Symbol>
			</Button>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none;
		overflow-x: auto;
	}

	ul,
	li {
		display: inline;
	}
</style>
