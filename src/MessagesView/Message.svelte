<script>
	import { createEventDispatcher, tick } from 'svelte';
	import MessageHeader from '../Message/MessageHeader.svelte';
	import MessageBody from '../Message/MessageBody.svelte';
	import Composition from '../CompositionView/Composition.svelte';
	import Button from '../Shared/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';
	import Message from '../Message/message.js';

	export let message = new Message();
	export let messenger;
	export let author;
	export let isAbsolutePositioning = true;

	const dispatch = createEventDispatcher();

	let symbolElements = [];
	let isReplying = false;
	let recycledFrom;
	let post;

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

	function download() {
		dispatch('download', message);
	}

	function onSubmit() {
		isReplying = false;
	}
</script>

<section bind:this={post}>
	<article>
		<MessageHeader {message} />
		<ul class="options">
			<li>
				<Button on:click={reply}><Symbol>↩︎</Symbol></Button>
			</li>
			<li>
				<Button on:click={recycle}><Symbol>♻︎</Symbol></Button>
			</li>
			<li>
				<Button on:click={download}><Symbol>📸︎</Symbol></Button>
			</li>
		</ul>
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
	ul {
		background-color: white;
		list-style-type: none;
		padding: 0;
	}
	section {
		padding-top: 1rem;
		position: relative;
		background-color: white;
	}

	li {
		margin-bottom: 0.5rem;
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
