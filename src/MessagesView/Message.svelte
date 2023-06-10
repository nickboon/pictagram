<script>
	import { tick } from 'svelte';
	import MessageHeader from '../Message/MessageHeader.svelte';
	import MessageBody from '../Message/MessageBody.svelte';
	import Composition from '../CompositionView/Composition.svelte';
	import Button from '../Util/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';
	import Message from '../Message/message.js';

	export let message = new Message();
	export let messenger;
	export let author;
	export let isAbsolutePositioning = true;

	let symbolElements = [];
	let isReplying = false;
	let recycledFrom;

	function reply() {
		isReplying = !isReplying;
	}

	function loadRecycledComposition() {
		message.isRecycled = true;
		recycledFrom = message;
		reply();
	}

	function recycle() {
		message = Message.clone(message);
		if (
			!isAbsolutePositioning &&
			message.symbolPositions === Message.symbolPositions.absolute
		) {
			message.toRelative();
			tick().then(() => {
				message = message.restoreOffset(symbolElements);
				loadRecycledComposition();
			});
			return;
		}
		if (
			isAbsolutePositioning &&
			message.symbolPositions === Message.symbolPositions.relative
		) {
			message = message.toAbsolute(symbolElements);
		}

		loadRecycledComposition();
	}

	function onSubmit() {
		isReplying = false;
	}
</script>

<section>
	<article>
		<MessageHeader {message} />
		<div class="options">
			<Button on:click={reply}><Symbol>↩︎</Symbol></Button>
			<Button on:click={recycle}><Symbol>♻︎</Symbol></Button>
		</div>
		<MessageBody {message} bind:symbolElements />
	</article>
	{#if isReplying}
		<Composition
			{recycledFrom}
			{messenger}
			{author}
			{isAbsolutePositioning}
			replyTo={Message.clone(message).toAbsolute(symbolElements)}
			on:submit={onSubmit}
		/>
	{/if}
</section>

<style>
	section {
		padding-top: 1rem;
		position: relative;
	}

	.options {
		display: none;
		position: absolute;
		right: 0;
		top: 1rem;
		z-index: 1;
	}

	section:hover .options {
		display: inline;
	}
</style>
