<script>
	export let message = '';
	export let test = () => false;
	export let isValid = true;

	let isDirty = false;

	function isHidden(test) {
		isValid = test();
		if (isDirty) return isValid;

		isDirty = true;
		return true;
	}

	$: hidden = isHidden(test);
</script>

<slot />
<div class:hidden>
	{message}
</div>

<style>
	div {
		color: red;
	}

	div.hidden {
		visibility: hidden;
	}
</style>
