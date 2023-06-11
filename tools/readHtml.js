import fs from 'fs';
import os from 'os';
import path from 'path';

export default function (filename) {
	const file = path.join(os.homedir(), 'Desktop', `${filename}.html`);
	console.log(`Reading HTML from ${file}...`);
	var text = fs.readFileSync(file, 'utf8').toString();
	return text;
}
