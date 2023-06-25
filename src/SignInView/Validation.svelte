<script>
	export let isValid = true;
</script>

<div class:isValid>
	<slot />
</div>

<style>
	div {
		color: red;
	}

	div.isValid {
		visibility: hidden;
	}
</style>
