<script>
	import Banner from './Banner.svelte';
	import Login from './LogInView/LogIn.svelte';
	import Composition from './CompositionView/Composition.svelte';
	import Messages from './MessagesView/Messages.svelte';
	import MessageService from './messageService';

	let viewed = false;
	let author = false;
	let token = false;
	let isAbsolutePositioning = true;
	let messages = [];
	let messenger = new MessageService(onMessageReceived, onUpdate);

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
		<Login bind:author bind:isAbsolutePositioning bind:token />
	{:else}
		<Composition {messenger} {author} {isAbsolutePositioning} bind:viewed />
		<Messages {messenger} {author} {isAbsolutePositioning} {messages} />
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
