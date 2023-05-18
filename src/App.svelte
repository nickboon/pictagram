<script>
	import Banner from './Banner.svelte';
	import WriteMessage from './WriteMessage.svelte';
	import ReadMessages from './ReadMessages.svelte';
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
	<WriteMessage {messenger} bind:viewed />
	<ReadMessages {messages} />
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
