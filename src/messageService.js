export default class MessageService {
	static messageSentEventName = 'messageSent';
	static updateEventName = 'update';
	static socket = io();

	constructor(messageRecievedHandler, updateHandler) {
		MessageService.socket.on(MessageService.updateEventName, updateHandler);
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
