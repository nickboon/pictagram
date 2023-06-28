<script>
	import Tools from './Tools.svelte';
	import Selected from './Selected.svelte';
	import Message from '../Message/message';

	export let message = new Message();
	export let highlight = false;

	let selected = 0;

	$: messageLength = message.body.length;
</script>

{#if messageLength > 0}
	<section>
		<div>
			<Tools selectedIndex={selected} bind:message />
		</div>
		<div>
			<Selected bind:highlight bind:selected bind:message />
		</div>
	</section>
{/if}

<style>
	section {
		margin-bottom: 1rem;
	}
</style>
