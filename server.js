import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import MessageStore from './messageStore.js';
import messageEvents from './messageEvents.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
	const onMessagesFetched = (messages) =>
		socket.emit(messageEvents.update, messages);
	const messageStore = new MessageStore(onMessagesFetched);

	socket.on(messageEvents.messageSent, (messageText, callback) => {
		io.emit(messageEvents.messageSent, messageText);
		messageStore.add(messageText);
		callback();
	});

	messageStore.fetch();
});

const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(currentDir, 'public')));
app.use(helmet());
app.use(compression());

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}...`));

export default server;
