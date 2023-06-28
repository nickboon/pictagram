<script>
	import Validation from './Validation.svelte';

	export let label = 'Password';
	export let value = '';
	export let isValid = false;

	const name = label.toLowerCase();
	const message = 'Required';

	$: test = () => !value.match(/^$|\s+/);
</script>

<Validation {test} {message} bind:isValid>
	<label for={name}>{label}:</label>
	<input type="password" {name} bind:value />
</Validation>

<style>
	label {
		display: block;
	}
</style>
