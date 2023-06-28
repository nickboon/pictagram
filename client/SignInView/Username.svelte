<script>
	import Validation from './Validation.svelte';

	export let value = '';
	export let isValid = false;

	const message = 'Required. Valid characters: a-z, A-Z, 0-9, _, ., - and @.';
	$: test = () => value.match(/^[a-zA-Z0-9_.\-@]+$/);
</script>

<Validation {test} {message} bind:isValid>
	<label for="username">Username:</label>
	<input type="text" name="username" bind:value />
</Validation>

<style>
	label {
		display: block;
	}
</style>
