<script>
	import Button from '../Util/Button.svelte';

	export let author = false;

	let value = '';
	let isSubmitDisabled = false;

	function format(value) {
		return value.replace(/[\s]/, ' ').trim();
	}

	function onSubmit() {
		if (!isValid) return;
		isSubmitDisabled = true;
		author = format(value);
		isSubmitDisabled = false;
	}

	$: isValid = value.match(/^[a-zA-Z0-9_.-@ ]*$/);
</script>

<form on:submit|preventDefault={onSubmit}>
	<input type="text" placeholder="Username" bind:value />
	<Button type="submit" disabled={isSubmitDisabled}>
		<span class="symbol">⇨︎🚪︎</span>
	</Button>
	{#if !isValid}
		<div class="error">Valid characters: a-z, A-Z, 0-9, _, ., - and @.</div>
	{/if}
</form>

<style>
	input {
		border: none;
		padding-bottom: 5px;
	}
	.error {
		color: red;
	}
</style>
