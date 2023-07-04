<script>
	import Validation from './Validation.svelte';
	import Validators from '../../domain/validators';

	export let value = '';
	export let isValid = false;

	const usernameValidator = Validators.username;
	const message = `Required. ${usernameValidator.message}`;
	$: test = () => usernameValidator.isValid(value);
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
