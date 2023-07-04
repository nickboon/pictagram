import UserStore from './userStore.js';
import UserModel from './userModel.js';

function handleErrors(error) {
	if (error.message.includes('validation failed'))
		Object.values(error.errors).forEach(({ properties }) =>
			console.log(properties.path, properties.message)
		);
	else console.log(error);
}

const userStore = new UserStore();
const post = {
	signup: async (req, res) => {
		try {
			const user = await userStore.create(req.body);
			const token = user.generateAuthToken();
			res
				.status(201)
				.header('x-auth-token', token)
				.json({ user: user.username });
		} catch (error) {
			if (error.code === 11000) res.sendStatus(409);
			else {
				handleErrors(error);
				res.sendStatus(400);
			}
		}
	},

	login: async (req, res) => {
		try {
			const user = await UserModel.login(req.body.username, req.body.password);
			const token = user.generateAuthToken();
			res
				.status(200)
				.header('x-auth-token', token)
				.json({ user: user.username });
		} catch (error) {
			handleErrors(error);
			res.status(400).json({ error: error.message });
		}
	},
};

export { post };
