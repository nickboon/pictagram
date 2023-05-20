<script>
	import Banner from './Banner.svelte';
	import SignIn from './SignInView/SignIn.svelte';
	import CompositionView from './CompositionView/Compose.svelte';
	import MessagesView from './MessagesView/Messages.svelte';
	import MessageService from './messageService';

	let viewed = false;
	let author = false;
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
	{#if author === false}
		<SignIn bind:author />
	{:else}
		<CompositionView {messenger} {author} bind:viewed />
		<MessagesView {messages} />
	{/if}
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
