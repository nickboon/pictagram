<script>
	import Banner from './Banner.svelte';
	import Login from './LogInView/LogIn.svelte';
	import Composition from './CompositionView/Composition.svelte';
	import Messages from './MessagesView/Messages.svelte';
	import Graph from './GraphView/Graph.svelte';
	import MessageService from './messageService';

	let viewed = false;
	let isLoginOpen = true;
	let isAbsolutePositioning = true;
	let messages = [];
	let isGraphOpen;
	let messenger;

	function routeToHash() {
		isGraphOpen = window.location.hash === '#graph';
		isLoginOpen = !isGraphOpen;
		if (isGraphOpen) messenger = new MessageService(onUpdate, false);
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

	routeToHash();
</script>

<main>
	{#if !isGraphOpen}
		<Banner bind:viewed />
	{/if}
	{#if isLoginOpen === true}
		<Login bind:isAbsolutePositioning on:login={onLogin} />
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

	Christopher {
		color: #ff0000;
	}
	Nick {
		color: #218f00;
	}
	Anon {
		color: #0077dd;
	}
	Bill {
		color: #0070df;
	}
	a9 {
		color: #006ae1;
	}
	a6 {
		color: #0065e3;
	}
	a5 {
		color: #005ee5;
	}
	a4 {
		color: #0057e7;
	}
	a3 {
		color: #004fea;
	}
	a2 {
		color: #0047ec;
	}
	a1 {
		color: #003eef;
	}
	a8 {
		color: #0032f2;
	}
	a7 {
		color: #0024f6;
	}
	Alice {
		color: #0000ff;
	}

	@media (min-width: 640px) {
		main {
			max-width: 50%;
		}
	}
</style>
