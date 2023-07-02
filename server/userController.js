import UserStore from './userStore.js';

function handleErrors(error) {
	if (error.message.includes('validation failed'))
		Object.values(error.errors).forEach(({ properties }) =>
			console.log(properties.path, properties.message)
		);
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
			// check if user exists and password matches
			// create token
			// return user and token
			res.send('New Login');
		} catch (error) {
			handleErrors(error);
			res.sendStatus(400);
		}
	},
};

export { post };
