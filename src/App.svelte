<script>
	import MessageService from './messageService';

	const messenger = new MessageService(onMessageReceived, onUpdate);

	let messages = [];
	let isSubmitDisabled = false;
	let input;

	function reset() {
		isSubmitDisabled = false;
		input.value = '';
		input.focus();
	}

	function onUpdate(update) {
		console.log('new update', update);
		messages = update;
	}

	function onMessageReceived(messageText) {
		messages = [messageText, ...messages];
	}

	function onMessageSent(error) {
		reset();
		if (error) return console.log(error);
	}

	function onSubmit(event) {
		isSubmitDisabled = true;
		const messageText = event.target.elements.message.value;
		messenger.sendMessage(messageText, onMessageSent);
	}
</script>

<main>
	<h1>Pictagram</h1>
	<form on:submit|preventDefault={onSubmit}>
		<input type="text" name="message" bind:this={input} />
		<button type="submit" disabled={isSubmitDisabled}>Send</button>
	</form>
	<ul>
		{#each messages as message}
			<li>{message}</li>
		{/each}
	</ul>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	ul {
		list-style-type: none;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
