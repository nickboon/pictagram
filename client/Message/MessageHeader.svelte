<script>
	import Message from './message';
	import MessageBody from './MessageBody.svelte';
	import Signature from './Signature.svelte';
	import Symbol from '../Message/Symbol.svelte';

	function formatAuthors(authors) {
		return [...new Set(authors.reverse())].join(', ');
	}

	export let message = new Message();
	export let includeReplyThumbnail = true;
</script>

<header>
	<Signature date={message.date} authors={message.authors[0]} />
	{#if message.replyTo}
		<span>
			<Symbol>{message.isRecycled ? '♻︎' : '↩︎'}</Symbol>
			<Signature
				date={message.replyTo.date}
				authors={formatAuthors(message.replyTo.authors)}
			/>
		</span>
		{#if includeReplyThumbnail}
			<div class="reply-to">
				<MessageBody message={message.replyTo} />
			</div>
		{/if}
	{/if}
</header>

<style>
	header {
		font-family: monospace;
		font-size: xx-small;
	}
	div {
		height: 5.5rem;
		opacity: 0.8;
		transform: scale(0.5);
		transform-origin: left top;
	}
</style>
