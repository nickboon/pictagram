import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import MessageStore from './messageStore.js';

const app = express();
const server = createServer(app);
const io = new Server(server);
const messageStore = new MessageStore();

io.on('connection', (socket) => {
	socket.on('messageSent', (messageText, callback) => {
		io.emit('messageSent', messageText);
		messageStore.add(messageText);
		callback();
	});
	socket.emit('update', messageStore.fetch());
});

const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(currentDir, 'public')));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}...`));

export default server;
