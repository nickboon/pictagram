import mongoose from 'mongoose';
import Message from '../domain/message.js';
import Validators from '../domain/validators.js';

const symbolTextValidator = Validators.symbolText;

const messageSchema = new mongoose.Schema({
	authors: {
		type: [String],
		default: [Message.default.author],
	},
	body: [
		{
			text: {
				type: String,
				trim: true,
				validate: [symbolTextValidator.isValid, symbolTextValidator.message],
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
			isInverted: {
				type: Boolean,
				default: false,
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
	downloadedBy: {
		type: [String],
		default: [],
	},
	repliedToBy: {
		type: [String],
		default: [],
	},
	recycledBy: {
		type: [String],
		default: [],
	},
	likedBy: {
		type: [String],
		default: [],
	},
});

messageSchema.add({
	replyTo: messageSchema,
});

const Model = mongoose.model('Message', messageSchema);

export default Model;
