import mongoose from 'mongoose';
import config from 'config';

class Db {
	connect() {
		const connectionString = config.get('db');
		mongoose
			.connect(connectionString)
			.then(() => console.log('Connected to DB', connectionString))
			.catch((err) =>
				console.error('Could not connect to db', connectionString, err)
			);
	}
}

export default function () {
	new Db().connect();
}
