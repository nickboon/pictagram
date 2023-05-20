<script>
	export let message;
</script>

<header>
	<time>{message.date.toString().slice(0, 24)}</time>
	<address>{message.authors.join(' ')}</address>
</header>

<style>
	address {
		display: inline;
	}
	header {
		font-family: monospace;
		font-size: xx-small;
	}
</style>
