import User from './userModel.js';

export default class UserStore {
	create(user) {
		return User.create(user);
	}
}
