import Message from '../messageModel.js';
import startupDb from '../startup/db.js';
import write from './writeJson.js';

startupDb();

Message.find()
	.sort({ _id: -1 })
	.then((messages) => {
		const indexed = messages.map((message, index) => {
			const clone = { ...message._doc };
			clone.index = index + 1;
			return clone;
		});
		write(indexed, 'getall');
		process.exit();
	});
