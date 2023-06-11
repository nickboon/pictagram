import Message from '../messageModel.js';
import startupDb from '../startup/db.js';

startupDb();

const args = process.argv.slice(2);
const id = args[0];

Message.findById(args[0]).then((message) => console.log(message));
