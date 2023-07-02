import config from 'config';

import messageEvents from '../../domain/messageEvents.js';

export default function (io, messageStore) {
	if (!config.get('jwtPrivateKey')) {
		console.error('FATAL ERROR: jwt private key is not defined');
		process.exit(1);
	}

	console.log('starting io');
	io.on('connection', (socket) => {
		const update = () =>
			messageStore
				.fetch()
				.then((messages) => socket.emit(messageEvents.update, messages));

		socket.on(messageEvents.messageSent, (messageText, callback) => {
			messageStore.add(messageText).then(update);
			callback();
		});

		socket.on(messageEvents.reactionSent, (reaction, callback) => {
			const update = {};
			update[reaction.key] = reaction.value;

			messageStore.putById(reaction.messageId, update).then(update);
			callback();
		});

		update();
	});
}
