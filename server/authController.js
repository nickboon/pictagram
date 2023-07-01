import UserStore from './userStore.js';

const userStore = new UserStore();

function handleErrors(error) {
	if (error.code === 11000) console.log('User already registered');

	if (error.message.includes('validation failed'))
		Object.values(error.errors).forEach(({ properties }) =>
			console.log(properties.path, properties.message)
		);
}

const post = {
	signup: async (req, res) => {
		try {
			const user = await userStore.create(req.body);
			res.status(201).json(user);
		} catch (error) {
			handleErrors(error);

			if (error.code === 11000) res.sendStatus(409);

			res.sendStatus(400);
		}
	},

	login: async (req, res) => {
		const { username, password } = req.body;
		console.log('POST login', username, password);

		res.send('New Login');
	},
};

export { post };
