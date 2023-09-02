import messageEvents from '../domain/messageEvents';

export default class MessageService {
	static socket;

	constructor(updateHandler, token) {
		MessageService.socket = io({ auth: { token } });
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

	sendImage(image, imageSentHandler) {
		MessageService.socket.emit(
			messageEvents.imageSent,
			image,
			imageSentHandler
		);
	}
}
