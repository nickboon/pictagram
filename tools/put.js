import Message from '../messageModel.js';
import readJson from './readJson.js';
import startupDb from '../startup/db.js';

startupDb();

const args = process.argv.slice(2);
const filename = args[0];

const message = readJson(filename);
message._id = null;

console.log(`Saving message...`);
new Message(message).save().then(() => {
	console.log('done.');
	process.exit();
});
