<script>
	import Tools from './Tools.svelte';
	import Spacer from './Spacer.svelte';
	import Selected from './Selected.svelte';
	import Message from '../message';

	export let message = new Message();
	export let highlight = false;

	let selected = 0;

	$: messageLength = message.symbols.length;
</script>

{#if messageLength > 0}
	<div>
		<Selected bind:highlight bind:selected bind:message />
		<Spacer />
		<Tools selectedIndex={selected} bind:message />
	</div>
{/if}

<style>
	div {
		margin-bottom: 1rem;
	}
</style>
