<script>
	import Symbol from '../Message/Symbol.svelte';
	import Button from '../Util/Button.svelte';

	export let message;
	export let highlight;
	export let selected;

	function setSelected(index) {
		selected = index;
		message.body.map((symbol) => (symbol.isSelected = false));
		message.body[index].isSelected = true;

		console.log('selected', selected);
		console.log('message', message.body);
		console.log('message.body[index]', message.body[index]);
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
	$: messageLength = message.body.length;
	$: onChange(messageLength);
</script>

<ul>
	{#each message.body as symbol, index}
		<li>
			<Button
				selected={symbol.isSelected}
				on:click={() => {
					console.log('click');
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
