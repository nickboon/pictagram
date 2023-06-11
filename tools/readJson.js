import fs from 'fs';
import os from 'os';
import path from 'path';

export default function (filename) {
	const file = path.join(os.homedir(), 'Desktop', `${filename}.json`);
	console.log(`Reading JSON from ${file}...`);
	var json = fs.readFileSync(file, 'utf8').toString();
	return JSON.parse(json);
}
