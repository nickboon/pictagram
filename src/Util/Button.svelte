<script>
	export let type = 'button';
	export let selected = false;
	export let disabled = false;
</script>

<button
	{type}
	class={selected ? 'selected' : ''}
	on:click
	on:mouseenter
	on:mouseleave
	{disabled}
>
	<slot />
</button>

<style>
	button {
		background-color: transparent;
		border: none;
		color: #555;
		cursor: pointer;
	}

	button:hover,
	.selected {
		outline: 1px solid #555;
	}

	button:active {
		opacity: 0.6;
	}

	button:disabled {
		opacity: 0.3;
	}
</style>
