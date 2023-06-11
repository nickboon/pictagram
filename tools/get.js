import Message from '../messageModel.js';
import startupDb from '../startup/db.js';
import write from './writeJson.js';

startupDb();

const args = process.argv.slice(2);
const id = args[0];

Message.findById(id).then((message) => {
	console.log(message);
	write(message, 'get');
	process.exit();
});
