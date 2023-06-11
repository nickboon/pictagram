import fs from 'fs';
import os from 'os';
import path from 'path';

export default function (js, filename) {
	const file = path.join(os.homedir(), 'Desktop', `${filename}.json`);

	var json = JSON.stringify(js, null, 2);
	fs.writeFileSync(file, json);
	console.log(`JSON written to ${file}`);
}
