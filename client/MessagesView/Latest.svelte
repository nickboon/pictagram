<script>
	import domtoimage from 'dom-to-image';
	import MessageHeader from '../Message/MessageHeader.svelte';
	import MessageBody from '../Message/MessageBody.svelte';

	export let message;

	let section;

	function update(message) {
		if (!message) {
			console.log(404);
			return;
		}

		section.querySelector('.reply-to')?.remove();

		domtoimage.toPng(section).then((dataUrl) => {
			const link = document.createElement('a');
			link.download = `${message._id}.png`;
			link.href = dataUrl;
			link.click();
			message = false;
		});
	}

	$: update(message);
</script>

<div>
	<section bind:this={section}>
		<article>
			<MessageHeader {message} />
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
