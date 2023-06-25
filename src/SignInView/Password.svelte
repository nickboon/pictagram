<script>
	import Validation from './Validation.svelte';

	export let label = 'Password';
	export let value = '';
	export let isValid = false;

	let name = label.toLowerCase();
	let isDirty = false;

	function onChange(value) {
		if (isDirty) {
			isValid = !value.match(/^$|\s+/);
			return isValid;
		}
		isDirty = true;
	}

	$: isCurrentlyValid = onChange(value);
</script>

<label for={name}>{label}:</label>
<input type="password" {name} bind:value />
<Validation isValid={isCurrentlyValid}>Required.</Validation>

<style>
	label {
		display: block;
	}
</style>
