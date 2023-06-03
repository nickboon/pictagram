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
			fontSize: Number,
			x: Number,
			y: Number,
			offsetLeft: Number,
			offsetTop: Number,
			scaleX: Number,
			scaleY: Number,
			angle: Number,
			opacity: Number,
		},
	],
	date: { type: Date, default: Date() },
	symbolPositions: {
		type: String,
		default: Message.default.symbolPositions,
	},
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
