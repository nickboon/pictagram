<script>
	import Banner from './Banner.svelte';
	import Login from './LogInView/LogIn.svelte';
	import Composition from './CompositionView/Composition.svelte';
	import Messages from './MessagesView/Messages.svelte';
	import Graph from './GraphView/Graph.svelte';
	import MessageService from './messageService';
	import Latest from './MessagesView/Latest.svelte';

	let viewed = false;
	let isLoginOpen = true;
	let isAbsolutePositioning = true;
	let messages = [];
	let isGraphRoute;
	let isLatestRoute;
	let messenger;

	function routeToHash() {
		isGraphRoute = window.location.hash === '#graph';
		isLatestRoute = window.location.hash === '#latest';
		isLoginOpen = !isGraphRoute && !isLatestRoute;
		if (isGraphRoute || isLatestRoute)
			messenger = new MessageService(onUpdate, false);
	}

	function onMessageEvent(error) {
		if (error) return console.error(error);
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

	function onLogin(event) {
		messenger = new MessageService(onUpdate, event.detail);
		isLoginOpen = false;
	}

	function onLatest(event) {
		messenger.sendImage(event.detail, onMessageEvent);
	}

	routeToHash();
</script>

{#if isGraphRoute}
	<Graph {messages} />
{:else if isLatestRoute}
	<Latest message={messages[0]} on:latest={onLatest} />
{:else}
	<main>
		<Banner bind:viewed />
		{#if isLoginOpen === true}
			<Login bind:isAbsolutePositioning on:login={onLogin} />
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
{/if}

<style>
	main {
		text-align: center;
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
