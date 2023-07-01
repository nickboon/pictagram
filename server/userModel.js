import mongoose from 'mongoose';
import Validators from '../domain/validators.js';

const usernameValidator = Validators.username;

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Required'],
		unique: true,
		validate: [usernameValidator.isValid, usernameValidator.message],
	},
	password: {
		type: String,
		required: [true, 'Required'],
	},
});

const Model = mongoose.model('User', userSchema);

export default Model;
