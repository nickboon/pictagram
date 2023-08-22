import config from 'config';
import messageEvents from '../../domain/messageEvents.js';
import { auth } from './socketMiddleware.js';
import Message from '../../domain/message.js';

export default function (io, messageStore) {
	if (!config.get('jwtPrivateKey')) {
		console.error('FATAL ERROR: jwt private key is not defined');
		process.exit(1);
	}

	console.log('starting io');
	io.use(auth);
	io.on('connection', async (socket) => {
		async function update() {
			await messageStore
				.fetch()
				.then((messages) => io.emit(messageEvents.update, messages));
		}

		socket.on(messageEvents.messageSent, async (message, callback) => {
			try {
				message.authors.unshift(socket.user);
				await messageStore.add(message).then(update);
				callback();
			} catch (error) {
				console.error(error);
			}
		});

		async function updateRecycled(id, callback) {
			const repliedToMessage = await messageStore.fetchById(id);
			updateReaction(Message.reactions.recycled, repliedToMessage, callback);

			if (repliedToMessage?.replyTo?._id)
				await updateRecycled(repliedToMessage.replyTo._id, callback);
		}

		async function updateReaction(action, message, callback) {
			const filter = {};
			const key = `${action}By`;
			const value = message[key];
			value.push(socket.user);
			filter[key] = value;
			messageStore.putById(message._id, filter).then(update);
			callback();
		}

		socket.on(
			messageEvents.reactionSent,
			async ({ action, message }, callback) => {
				try {
					if (
						action === Message.reactions.liked &&
						message?.likedBy.includes(socket.user)
					) {
						return;
					}

					await updateReaction(action, message, callback);

					if (action === Message.reactions.recycled && message?.replyTo?._id) {
						await updateRecycled(message.replyTo._id, callback);
						return;
					}
				} catch (error) {
					console.error(error);
				}
			}
		);

		try {
			await update();
		} catch (error) {
			console.error(error);
		}
	});
}
