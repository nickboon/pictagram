<script>
	export let message;
</script>

<header>
	<time>{message.date.toString().slice(0, 24)}</time>
</header>

<style>
	header {
		font-family: monospace;
		font-size: xx-small;
	}
</style>
