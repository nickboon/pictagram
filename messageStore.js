import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	authors: {
		type: [String],
		default: ['anon'],
	},
	body: [
		{
			text: {
				type: String,
				validate: (text) => {
					/^[←-🫶]{1}$/.test(text);
				},
			},
			fontSize: Number,
			x: Number,
			y: Number,
			scaleX: Number,
			scaleY: Number,
			angle: Number,
			opacity: Number,
			isSelected: Boolean,
		},
	],
	date: { type: Date, default: Date() },
});

const Message = mongoose.model('Message', messageSchema);

export default class MessageStore {
	constructor(onFetch = () => {}) {
		this.onFetch = onFetch;
	}

	async fetch() {
		const messages = await Message.find().sort({ _id: -1 });
		this.onFetch(messages);
	}

	async add(message) {
		const document = new Message(message);
		await document.save();
	}
}
