// messenger service
class Messenger {
	static messageSentEventName = 'messageSent';
	static socket = io();

	constructor(messageRecievedHandler) {
		Messenger.socket.on(Messenger.messageSentEventName, messageRecievedHandler);
	}

	sendMessage(message) {
		Messenger.socket.emit(
			Messenger.messageSentEventName,
			message,
			onMessageSent
		);
	}
}

// page elements
const messenger = new Messenger(onMessageReceived);

const form = document.querySelector('form');
const input = form.querySelector('input');
const button = form.querySelector('button');
const messages = document.querySelector('#messages');

function onMessageReceived(messageText) {
	messages.insertAdjacentHTML('beforeEnd', `<p>${messageText}</p>`);
}

function onMessageSent(error) {
	button.removeAttribute('disabled');
	input.value = '';
	input.focus();

	if (error) return console.log(error);
}

form.addEventListener('submit', (event) => {
	event.preventDefault();

	button.setAttribute('disabled', 'disabled');

	const messageText = event.target.elements.message.value;
	messenger.sendMessage(messageText);
});
