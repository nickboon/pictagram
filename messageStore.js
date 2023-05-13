const messages = [];
export default class MessageStore {
	fetch() {
		return messages;
	}

	add(message) {
		messages.unshift(message);
	}
}
