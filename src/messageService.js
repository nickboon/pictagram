export default class MessageService {
	static messageSentEventName = 'messageSent';
	static socket = io();

	constructor(messageRecievedHandler) {
		MessageService.socket.on(
			MessageService.messageSentEventName,
			messageRecievedHandler
		);
	}

	sendMessage(message, messageSenthander) {
		MessageService.socket.emit(
			MessageService.messageSentEventName,
			message,
			messageSenthander
		);
	}
}
