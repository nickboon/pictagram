<script>
	export let code;

	const text = `&#${code};&#xFE0E;`;
</script>

{@html text}
