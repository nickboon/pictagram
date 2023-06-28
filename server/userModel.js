import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		// ToDo: sanitise with regex
	},
	password: {
		type: String,
		required: true,
	},
});

const Model = mongoose.model('User', userSchema);

export default Model;
