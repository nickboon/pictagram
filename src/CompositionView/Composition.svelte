<script>
	import { createEventDispatcher } from 'svelte';
	import SymbolViewer from './SymbolViewer.svelte';
	import Toolbar from './Toolbar.svelte';
	import MessageBody from '../Message/MessageBody.svelte';
	import Button from '../Util/Button.svelte';
	import Highlight from '../Util/Highlight.svelte';
	import Message from '../Message/message';

	export let messenger;
	export let author;
	export let viewed = false;
	export let isAbsolutePositioning = true;

	const dispatch = createEventDispatcher();
	const symbolPositions = isAbsolutePositioning ? 'absolute' : 'relative';

	let highlight = false;
	let message = new Message([author || 'anon'], symbolPositions);
	$: isSubmitDisabled = message.isEmpty;

	function reset() {
		message.empty();
	}

	function onMessageSent(error) {
		if (error) return console.log(error);
	}

	function onSubmit() {
		isSubmitDisabled = true;
		message.date = Date();
		messenger.sendMessage(message, onMessageSent);
		reset();
		dispatch('submit');
	}
</script>

<SymbolViewer bind:message bind:viewed />
<Toolbar bind:message bind:highlight />
{#if !message.isEmpty}
	<div id="composition">
		<Highlight {highlight} selector={'.symbol'}>
			<MessageBody {message} />
		</Highlight>
	</div>
{/if}
<form on:submit|preventDefault={onSubmit}>
	<Button type="submit" disabled={isSubmitDisabled}>
		<span class="symbol">📨︎</span>
	</Button>
</form>

<style>
	form {
		border-bottom: 1px solid #555;
		margin: 0.5rem 0 1rem;
		padding-bottom: 3rem;
		text-align: center;
	}

	div {
		background-color: white;
		outline: 1px solid #555;
		margin-bottom: 0.5rem;
	}
	span {
		font-size: 2rem;
	}
</style>
