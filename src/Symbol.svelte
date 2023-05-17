<script>
	export let code;

	const text = `&#${code};&#xFE0E;`;
</script>

<span class="symbol">{@html text}</span>
