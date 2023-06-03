import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import MessageStore from './messageStore.js';
import startupDb from './startup/db.js';
import startupIo from './startup/io.js';
import startupRoutes from './startup/routes.js';
import startupProduction from './startup/production.js';
import startupStatic from './startup/static.js';

const messageStore = new MessageStore();
const app = express();
const server = createServer(app);
const io = new Server(server);

startupDb();
startupIo(io, messageStore);
startupStatic(app);
startupRoutes(app, messageStore);

startupProduction(app);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}...`));

export default server;
