<script>
	import Validation from './Validation.svelte';

	export let value = '';
	export let isValid = false;

	let isDirty = false;

	function onChange(value) {
		if (isDirty) {
			isValid = value.match(/^[a-zA-Z0-9_.\-@]+$/);
			return isValid;
		}
		isDirty = true;
	}

	$: isCurrentlyValid = onChange(value);
</script>

<label for="username">Username:</label>
<input type="text" name="username" bind:value />
<Validation isValid={isCurrentlyValid}>
	Required. Valid characters: a-z, A-Z, 0-9, _, ., - and @.
</Validation>

<style>
	label {
		display: block;
	}
</style>
