const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketio(server);
io.on('connection', (socket) => {
	socket.on('messageSent', (messageText, callback) => {
		io.emit('messageSent', messageText);
		callback();
	});
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;
