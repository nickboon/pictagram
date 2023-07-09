import Message from './messageModel.js';

export default class MessageStore {
	fetch() {
		return Message.find().sort({ _id: -1 });
	}

	fetchById(id) {
		return Message.findById(id);
	}

	add(message) {
		return new Message(message).save();
	}

	putById(id, filter) {
		return Message.findByIdAndUpdate(id, filter);
	}
}
