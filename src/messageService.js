import messageEvents from '../messageEvents';

export default class MessageService {
	static socket = io();

	constructor(messageRecievedHandler, updateHandler) {
		MessageService.socket.on(messageEvents.messageSent, messageRecievedHandler);
		MessageService.socket.on(messageEvents.update, updateHandler);
	}

	sendMessage(message, messageSenthander) {
		MessageService.socket.emit(
			messageEvents.messageSent,
			message,
			messageSenthander
		);
	}

	reactToMessage(reaction, reactionHandler) {
		MessageService.socket.emit(
			messageEvents.reactionSent,
			reaction,
			reactionHandler
		);
	}
}
