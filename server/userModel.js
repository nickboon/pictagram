import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
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

const maxage = 3 * 24 * 60 * 60;
const secret = config.get('jwtPrivateKey');

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ user: this.username }, secret, {
		expiresIn: maxage,
	});
	return token;
};

userSchema.statics.login = async function (username, password) {
	const user = await this.findOne({ username });
	if (user) {
		const isValid = await bcrypt.compare(password, user.password);
		console.log('isValid', isValid);
		if (isValid) return user;
		throw Error('Invalid credentials');
	}
	throw Error('Invalid credentials');
};

userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

const Model = mongoose.model('User', userSchema);

export default Model;
