<script>
	export let style = undefined;
	export let symbolElement;
</script>

<span class="symbol" {style} bind:this={symbolElement}><slot /></span>
