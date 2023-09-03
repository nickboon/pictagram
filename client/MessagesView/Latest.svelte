<script>
	import { createEventDispatcher } from 'svelte';
	import domToImage from 'dom-to-image';
	import MessageHeader from '../Message/MessageHeader.svelte';
	import MessageBody from '../Message/MessageBody.svelte';

	export let message;

	const dispatch = createEventDispatcher();
	let section;

	function update(message) {
		if (!message) return;

		section.querySelector('.reply-to')?.remove();

		domToImage.toBlob(section).then((blob) => {
			dispatch('latest', {
				id: message._id,
				blob,
			});
		});
	}

	$: update(message);
</script>

<div>
	<section bind:this={section}>
		<article>
			<MessageHeader {message} includeReplyThumbnail={false} />
			<MessageBody {message} />
		</article>
	</section>
</div>

<style>
	div,
	section {
		background-color: white;
	}

	div {
		max-width: 240px;
	}

	section {
		padding: 1rem;
		text-align: left;
	}

	@keyframes blinker {
		50% {
			opacity: 0;
		}
	}

	@media (min-width: 640px) {
		div {
			max-width: 50%;
			width: 50%;
		}
	}
</style>
