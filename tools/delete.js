import Message from '../messageModel.js';
import startupDb from '../startup/db.js';

startupDb();

const args = process.argv.slice(2);
const id = args[0];

Message.findOneAndDelete({ _id: id }).then((message) => console.log(message));
