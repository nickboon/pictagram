import config from 'config';
import messageEvents from '../../domain/messageEvents.js';
import { auth } from './socketMiddleware.js';

export default function (io, messageStore) {
	if (!config.get('jwtPrivateKey')) {
		console.error('FATAL ERROR: jwt private key is not defined');
		process.exit(1);
	}

	console.log('starting io');
	io.use(auth);
	io.on('connection', (socket) => {
		const update = () =>
			messageStore
				.fetch()
				.then((messages) => socket.emit(messageEvents.update, messages));

		socket.on(messageEvents.messageSent, (message, callback) => {
			message.authors.unshift(socket.user);
			messageStore.add(message).then(update);
			callback();
		});

		socket.on(messageEvents.reactionSent, ({ action, message }, callback) => {
			const filter = {};
			const key = `${action}By`;
			const value = message[key];
			value.push(socket.user);
			filter[key] = value;
			messageStore.putById(message._id, filter).then(update);

			callback();
		});

		update();
	});
}
