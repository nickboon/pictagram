// https://stackoverflow.com/questions/25548060/converting-pt-and-px

import Message from '../messageModel.js';
import startupDb from '../startup/db.js';
import write from './writeJson.js';

startupDb();

const args = process.argv.slice(2);
const id = args[0];
const ptToPxRatio = 72 / 96;

function toPx(body) {
	return body.map((symbol) => {
		symbol.x /= ptToPxRatio;
		symbol.y /= ptToPxRatio;
		if (symbol.offsetLeft) symbol.offsetLeft /= ptToPxRatio;
		if (symbol.offsetTop) symbol.offsetTop /= ptToPxRatio;

		return symbol;
	});
}

console.log(`converting message ${id} from pt to px...`);
Message.findById(args[0]).then((message) => {
	write(message, 'toPx');

	message.body = toPx(message.body);
	console.log('saving...');
	message.save().then(() => {
		console.log('done.');
		process.exit();
	});
});
