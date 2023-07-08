import jwt from 'jsonwebtoken';
import config from 'config';
import Message from '../../domain/message.js';

function auth(socket, next) {
	const token = socket.handshake.auth?.token;
	try {
		socket.user = token
			? jwt.verify(token, config.get('jwtPrivateKey')).user
			: Message.default.author;
	} catch (err) {
		socket.user = Message.default.author;
	}
	next();
}

export { auth };
