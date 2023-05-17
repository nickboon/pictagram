<script>
	import MessageService from './messageService';
	import SymbolSelect from './SymbolSelect.svelte';
	import MessageToolbar from './MessageToolbar.svelte';
	import Message from './Message.svelte';
	import Button from './Button.svelte';
	import MessageObject from './message';

	const messenger = new MessageService(onMessageReceived, onUpdate);

	let message = new MessageObject();
	let viewed = false;
	let group = false;
	$: symbol = viewed;
	let messages = [];
	$: isSubmitDisabled = message.isEmpty;

	function reset() {
		isSubmitDisabled = false;
		console.log('clear');
		message.symbols.length = 0;
		console.log(message.symbols);
	}

	function onUpdate(update) {
		messages = update;
	}

	function onMessageReceived(recievedMessage) {
		messages = [recievedMessage, ...messages];
	}

	function onMessageSent(error) {
		reset();
		if (error) return console.log(error);
	}

	function onSubmit() {
		isSubmitDisabled = true;
		message.date = Date();

		messenger.sendMessage(message, onMessageSent);
	}
</script>

<main>
	<h1 class:symbol>{viewed || 'Pictagram'}</h1>
	<SymbolSelect bind:message bind:viewed />
	<MessageToolbar bind:message bind:group />
	<Message {message} bind:group />
	<form on:submit|preventDefault={onSubmit}>
		<Button type="submit" disabled={isSubmitDisabled}>
			<span class="large symbol">📨︎</span>
		</Button>
	</form>
	<ul>
		{#each messages as message}
			<li>
				<span class="smalltext">{message.date.toString().slice(0, 24)}</span>
				<div class="positionable_container">
					{#each message.symbols as symbol}
						<span
							class="symbol positionable"
							style="font-size:{symbol.fontSize}px;opacity:{symbol.opacity};transform: translate({symbol.x}pt, {symbol.y}pt) rotate({symbol.angle}deg) scaleX({symbol.scaleX}) scaleY({symbol.scaleY});"
							>{symbol.text}</span
						>
					{/each}
				</div>
			</li>
		{/each}
	</ul>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		height: 100%;
	}

	h1 {
		color: #ff3e00;
		font-weight: 100;
		height: 4rem;
		text-transform: uppercase;
		display: inline-block;
	}

	ul {
		list-style-type: none;
		margin-top: 1.5rem;
		border-top: 1px solid #555;
		text-align: left;
		padding: 1rem 0;
	}

	li {
		margin-top: 1rem;
	}

	form {
		margin: 0.5rem 0 3rem;
	}

	.large.symbol {
		font-size: 2rem;
	}

	.smalltext {
		font-family: monospace;
		font-size: xx-small;
	}

	.positionable {
		display: inline-block;
	}

	.positionable_container {
		margin: 0.5rem 0 2rem;
		min-height: 4rem;
		max-height: 10rem;
		overflow: hidden;
		padding: 0.5rem;
		text-align: left;
	}

	@media (min-width: 640px) {
		h1 {
			font-size: 4em;
		}
		main {
			max-width: 50%;
		}
	}
</style>
