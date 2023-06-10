<!-- 
Requirements
------------
1. A composition should be set to the position specified at sigin.
2. A user should be able to save an absolutely positioned message as relative.
3. A user should be able to save a relatively positioned message as absolute.
4. When a user replies to a message, an absolute clone should be saved as the message reply to property.
5. A raster produce from a relative message should use the original offset from the users browser saved at the point of posting.
-->

<script>
	import { createEventDispatcher } from 'svelte';
	import SymbolViewer from './SymbolViewer.svelte';
	import Toolbar from './Toolbar.svelte';
	import MessageBody from '../Message/MessageBody.svelte';
	import Button from '../Util/Button.svelte';
	import Highlight from '../Util/Highlight.svelte';
	import Message from '../Message/message';
	import Symbol from '../Message/Symbol.svelte';

	export let messenger;
	export let author = Message.default.author;
	export let viewed = false;
	export let isAbsolutePositioning = true;
	export let replyTo = undefined;
	export let recycledFrom = undefined;

	const dispatch = createEventDispatcher();
	const symbolPositions = isAbsolutePositioning
		? Message.symbolPositions.absolute
		: Message.symbolPositions.relative;

	let highlight = false;
	let message = recycledFrom || new Message({ authors: [] });
	let symbolElements = [];

	message.authors.unshift(author || Message.default.author);
	message.symbolPositions = symbolPositions;

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

		// Save an absolutely postioned clone of replied to message for replyTo thumbnail
		if (replyTo) message.replyTo = replyTo;

		// Save original offsets for recreating original positioning e.g. when convertig to raster
		if (symbolPositions === Message.symbolPositions.relative)
			message.setOffset(symbolElements);

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
			<MessageBody {message} bind:symbolElements />
		</Highlight>
	</div>
{/if}
<form on:submit|preventDefault={onSubmit}>
	<Button type="submit" disabled={isSubmitDisabled}>
		<Symbol>📨︎</Symbol>
	</Button>
</form>

<style>
	form {
		border-bottom: 1px solid #555;
		font-size: 2rem;
		margin: 0.5rem 0 1rem;
		padding-bottom: 3rem;
		text-align: center;
	}

	div {
		background-color: white;
		outline: 1px solid #555;
		margin-bottom: 0.5rem;
	}
</style>
