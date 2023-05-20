<script>
	import SymbolViewer from './SymbolViewer.svelte';
	import Toolbar from './Toolbar.svelte';
	import Message from '../Message.svelte';
	import Button from '../Util/Button.svelte';
	import Highlight from '../Util/Highlight.svelte';
	import MessageObject from '../message';

	export let viewed;
	export let messenger;

	let message = new MessageObject();
	let highlight = false;
	$: isSubmitDisabled = message.isEmpty;

	function reset() {
		isSubmitDisabled = false;
		message.symbols.length = 0;
	}

	function onMessageSent(error) {
		reset();
		if (error) return console.log(error);
	}

	function onSubmit() {
		isSubmitDisabled = true;
		message.date = Date();
		messenger.sendMessage(message, onMessageSent);
	}
</script>

<SymbolViewer bind:message bind:viewed />
<Toolbar bind:message bind:highlight />
{#if !message.isEmpty}
	<div>
		<Highlight {highlight} selector={'.symbol'}>
			<Message {message} />
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
		margin: 0.5rem 0 3rem;
	}

	div {
		outline: 1px solid #555;
		margin-bottom: 0.5rem;
	}
	span {
		font-size: 2rem;
	}
</style>
