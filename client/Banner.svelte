<script>
	export let viewed = false;
	$: symbol = viewed;
</script>

<h1 class:symbol>{viewed || 'Pictagram'}</h1>

<style>
	h1 {
		font-weight: 100;
		height: 4rem;
		text-transform: uppercase;
		display: inline-block;
	}

	@media (min-width: 640px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
