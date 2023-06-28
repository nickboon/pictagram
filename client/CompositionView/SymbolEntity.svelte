<script>
	export let code;

	$: text = `&#${code};&#xFE0E;`;
</script>

{@html text}
