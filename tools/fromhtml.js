// https://github.com/taoqf/node-html-parser
import { parse } from 'node-html-parser';
import MessageModel from '../messageModel.js';
import startupDb from '../startup/db.js';
import readHtml from './readHtml.js';
import Symbol from '../src/Message/symbol.js';
import Message from '../src/Message/message.js';

startupDb();

const args = process.argv.slice(2);
const filename = args[0];
const authors = args[1]?.slice(';') || ['Nick'];
const symbolPositions = args[2] || Message.symbolPositions.relative;
const ptToPxRatio = 72 / 96;

function parseTranslation(translation) {
	const isPoints = translation.endsWith('pt');
	let int = parseInt(translation.slice(0, -2));
	return isPoints ? (int /= ptToPxRatio) : int;
}

function getX(translate) {
	return parseTranslation(translate.split(',')[0]);
}

function getY(translate) {
	const translation = translate.split(',');
	return translation.length < 2 ? 0 : parseTranslation(translation[1]);
}

const html = readHtml(filename);
const symbolElements = parse(html).querySelectorAll('.symbol');
const body = Array.from(symbolElements).map((element) => {
	const text = element.textContent;
	const style = element.getAttribute('style').replace(/\s*|\t|\r|\n/gm, '');
	const fontSize = parseInt(
		/(?<=font-size:)[^;]+/.exec(style)[0].replace('px', '')
	);
	const x = getX(/(?<=translate\()[^\)]+/.exec(style)[0]);
	const y = getY(/(?<=translate\()[^\)]+/.exec(style)[0]);
	const scaleX = parseInt(/(?<=scaleX\()[^\)]+/.exec(style)[0]);
	const scaleY = parseInt(/(?<=scaleY\()[^\)]+/.exec(style)[0]);
	const angle = parseInt(
		/(?<=rotate\()[^\)]+/.exec(style)[0].replace('deg', '')
	);
	const opacity = parseInt(/(?<=opacity:)[^;]+/.exec(style)[0]);

	return new Symbol({
		text,
		fontSize,
		x,
		y,
		scaleX,
		scaleY,
		angle,
		opacity,
	});
});

const message = new Message({
	authors,
	symbolPositions,
	body,
});

console.log(`Saving message...`);
new MessageModel(message).save().then(() => {
	console.log('done.');
	process.exit();
});
