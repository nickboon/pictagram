<script>
	import Banner from './Banner.svelte';
	import CopositionView from './CompositionView/Compose.svelte';
	import MessagesView from './MessagesView/Messages.svelte';
	import MessageService from './messageService';

	let viewed = false;

	let messages = [];
	const messenger = new MessageService(onMessageReceived, onUpdate);

	function onUpdate(update) {
		messages = update;
	}

	function onMessageReceived(recievedMessage) {
		messages = [recievedMessage, ...messages];
	}
</script>

<main>
	<Banner bind:viewed />
	<CopositionView {messenger} bind:viewed />
	<MessagesView {messages} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		height: 100%;
	}

	@media (min-width: 640px) {
		main {
			max-width: 50%;
		}
	}
</style>
