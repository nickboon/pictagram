import messageEvents from '../messageEvents.js';

export default function (io, messageStore) {
	console.log('starting io');
	io.on('connection', (socket) => {
		socket.on(messageEvents.messageSent, (messageText, callback) => {
			io.emit(messageEvents.messageSent, messageText);
			messageStore.add(messageText);
			callback();
		});

		messageStore
			.fetch()
			.then((messages) => socket.emit(messageEvents.update, messages));
	});
}
