import messageEvents from '../messageEvents';

export default class MessageService {
	static socket = io();

	constructor(messageRecievedHandler, updateHandler) {
		MessageService.socket.on(messageEvents.update, updateHandler);
		MessageService.socket.on(messageEvents.messageSent, messageRecievedHandler);
	}

	sendMessage(message, messageSenthander) {
		MessageService.socket.emit(
			messageEvents.messageSent,
			message,
			messageSenthander
		);
	}
}
