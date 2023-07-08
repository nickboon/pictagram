<script>
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
	export let messenger;
	//export let author;
	export let isAbsolutePositioning = true;

	//const dispatch = createEventDispatcher();

	let symbolElements = [];
	let isReplying = false;
	let recycledFrom;
	let post;
	let download = false;

	function onReactionSent(error) {
		if (error) return console.log(error);
	}

	function onReply() {
		isReplying = !isReplying;
	}

	function loadRecycledComposition() {
		message.isRecycled = true;
		recycledFrom = message;
		onReply();
	}

	function onRecycle() {
		message = Message.clone(message);

		if (
			!isAbsolutePositioning &&
			message.symbolPositions === Consts.symbolPositions.absolute
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
			message.symbolPositions === Consts.symbolPositions.relative
		) {
			message = message.toAbsolute(symbolElements);
		}

		loadRecycledComposition();
	}

	function onDownload() {
		download = message;
		const reaction = new Reaction(Reaction.actions.downloaded, message);
		messenger.reactToMessage(reaction, onReactionSent);
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
				<Button on:click={onReply}><Symbol>↩︎</Symbol></Button>
			</li>
			<li>
				<Button on:click={onRecycle}><Symbol>♻︎</Symbol></Button>
			</li>
			<li>
				<Button on:click={onDownload}><Symbol>📸︎</Symbol></Button>
			</li>
		</ul>
		<MessageBody {message} bind:symbolElements />
	</article>
	{#if isReplying}
		<Composition
			{recycledFrom}
			{messenger}
			{isAbsolutePositioning}
			replyTo={Message.clone(message).toAbsolute(symbolElements)}
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
