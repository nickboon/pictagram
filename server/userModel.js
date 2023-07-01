import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
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

userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

const Model = mongoose.model('User', userSchema);

export default Model;
