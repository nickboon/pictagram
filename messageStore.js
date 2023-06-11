import Message from './messageModel.js';

export default class MessageStore {
	fetch() {
		return Message.find().sort({ _id: -1 });
	}

	add(message) {
		new Message(message).save();
	}
}
