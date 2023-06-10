import mongoose from 'mongoose';
import Message from './src/Message/message.js';

const messageSchema = new mongoose.Schema({
	authors: {
		type: [String],
		default: Message.default.authors,
	},
	body: [
		{
			text: {
				type: String,
				trim: true,
				validate: (text) => {
					/^[←-🫶]{1}$/.test(text);
				},
			},
			fontSize: {
				type: Number,
				default: 24,
			},
			x: {
				type: Number,
				default: 0,
			},
			y: {
				type: Number,
				default: 0,
			},
			offsetLeft: {
				type: Number,
				default: 0,
			},
			offsetTop: {
				type: Number,
				default: 0,
			},
			scaleX: {
				type: Number,
				default: 1,
			},
			scaleY: {
				type: Number,
				default: 1,
			},
			angle: {
				type: Number,
				default: 0,
			},
			opacity: {
				type: Number,
				default: 1,
			},
		},
	],
	date: { type: Date, default: Date() },
	symbolPositions: {
		type: String,
		default: Message.default.symbolPositions,
	},
	isRecycled: {
		type: Boolean,
		default: false,
	},
});

messageSchema.add({
	replyTo: messageSchema,
});

const Model = mongoose.model('Message', messageSchema);

export default class MessageStore {
	fetch() {
		return Model.find().sort({ _id: -1 });
	}

	getById(id) {
		return Model.findById(id);
	}

	add(message) {
		new Model(message).save();
	}
}
