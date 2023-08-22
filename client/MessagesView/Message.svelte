<script>
	import { createEventDispatcher, tick } from 'svelte';
	import MessageHeader from '../Message/MessageHeader.svelte';
	import MessageBody from '../Message/MessageBody.svelte';
	import Composition from '../CompositionView/Composition.svelte';
	import Button from '../Shared/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';
	import Overlay from '../Shared/Overlay.svelte';
	import Download from './Download.svelte';
	import Message from '../Message/message';
	import Consts from '../../domain/message';
	import Reaction from './reaction';

	export let message = new Message();
	export let isAbsolutePositioning = true;

	const dispatch = createEventDispatcher();

	let symbolElements = [];
	let isReplying = false;
	let messageToRecycle = undefined;
	let post;
	let download = false;

	function dispatchReaction(action, message) {
		dispatch('react', new Reaction(action, message));
	}

	function onReply() {
		isReplying = !isReplying;
	}

	function loadRecycledComposition(clone) {
		clone.isRecycled = true;
		messageToRecycle = clone;
		isReplying = !isReplying;
	}

	function onRecycle() {
		let clone = Message.clone(message);

		if (
			!isAbsolutePositioning &&
			clone.symbolPositions === Consts.symbolPositions.absolute
		) {
			clone.toRelative();
			tick().then(() => {
				clone = clone.restoreOffset(symbolElements);
				loadRecycledComposition(clone);
			});
			return;
		}
		if (
			isAbsolutePositioning &&
			clone.symbolPositions === Consts.symbolPositions.relative
		) {
			clone = clone.toAbsolute(symbolElements);
		}

		loadRecycledComposition(clone);
	}

	function onDownload() {
		download = message;
		dispatchReaction(Consts.reactions.downloaded, message);
	}

	function onLike() {
		dispatchReaction(Consts.reactions.liked, message);
	}

	function onSubmit(event) {
		const newMessage = event.detail;
		dispatch('submit', newMessage);

		const action = newMessage.isRecycled
			? Consts.reactions.recycled
			: Consts.reactions.repliedTo;
		dispatch('react', new Reaction(action, message));
		isReplying = false;
	}

	function buildReplyTo() {
		const replyTo = Message.clone(message).toAbsolute(symbolElements);
		replyTo._id = message._id;
		return replyTo;
	}
</script>

<section bind:this={post}>
	<article>
		<MessageHeader {message} />
		<ul class="options">
			<li>
				<Button on:click={onLike}><Symbol>👍︎</Symbol></Button>
				{message.likedBy.length}
			</li>
			<li>
				<Button on:click={onReply}><Symbol>↩︎</Symbol></Button>
				{message.repliedToBy.length}
			</li>
			<li>
				<Button on:click={onRecycle}><Symbol>♻︎</Symbol></Button>
				{message.recycledBy.length}
			</li>
			<li>
				<Button on:click={onDownload}><Symbol>📸︎</Symbol></Button>
				{message.downloadedBy.length}
			</li>
		</ul>
		<MessageBody {message} bind:symbolElements />
	</article>
	{#if isReplying}
		<Composition
			message={messageToRecycle}
			{isAbsolutePositioning}
			replyTo={buildReplyTo()}
			on:submit={onSubmit}
		/>
	{/if}
</section>
{#if download}
	<Overlay>
		<Download bind:message={download} />
	</Overlay>
{/if}

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
