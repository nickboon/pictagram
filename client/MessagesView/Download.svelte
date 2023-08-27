<script>
	import { onMount } from 'svelte';
	import domtoimage from 'dom-to-image';
	import MessageHeader from '../Message/MessageHeader.svelte';
	import MessageBody from '../Message/MessageBody.svelte';
	import Symbol from '../Message/Symbol.svelte';

	export let message;

	let section;

	onMount(() => {
		section.querySelector('.reply-to')?.remove();

		domtoimage.toPng(section).then((dataUrl) => {
			const link = document.createElement('a');
			link.download = `${message._id}.png`;
			link.href = dataUrl;
			link.click();
			message = false;
		});
	});
</script>

<div>
	<h2>
		<Symbol>📸︎</Symbol>
	</h2>
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

	h2 {
		animation: blinker 1s linear infinite;
		text-align: center;
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
