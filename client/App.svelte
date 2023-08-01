<script>
	import Banner from './Banner.svelte';
	import Login from './LogInView/LogIn.svelte';
	import Composition from './CompositionView/Composition.svelte';
	import Messages from './MessagesView/Messages.svelte';
	import Graph from './GraphView/Graph.svelte';
	import MessageService from './messageService';

	let viewed = false;
	let isLoginOpen = true;
	let token = false;
	let isAbsolutePositioning = true;
	let messages = [];
	let messenger;

	const isGraphOpen = window.location.hash === '#graph';

	function onMessageEvent(error) {
		if (error) return console.log(error);
	}

	function onSubmit(event) {
		messenger.sendMessage(event.detail, onMessageEvent);
	}

	function onReact(event) {
		messenger.reactToMessage(event.detail, onMessageEvent);
	}

	function onUpdate(update) {
		messages = update;
	}

	function onMessageReceived(recievedMessage) {
		messages = [recievedMessage, ...messages];
	}

	function onChange(isLoginOpen) {
		if (messenger) return;
		messenger = new MessageService(onMessageReceived, onUpdate, token);
	}

	$: onChange(isLoginOpen);
</script>

<main class:isGraphOpen>
	<Banner bind:viewed />
	{#if isLoginOpen === true}
		<Login bind:isOpen={isLoginOpen} bind:isAbsolutePositioning bind:token />
	{:else if isGraphOpen}
		<Graph {messages} />
	{:else}
		<Composition {isAbsolutePositioning} bind:viewed on:submit={onSubmit} />
		<Messages
			{isAbsolutePositioning}
			{messages}
			on:react={onReact}
			on:submit={onSubmit}
		/>
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
