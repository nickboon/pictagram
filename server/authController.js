import UserStore from './userStore.js';

const userStore = new UserStore();

const post = {
	signup: async (req, res) => {
		try {
			const user = await userStore.create(req.body);
			res.status(201).json(user);
		} catch (error) {
			console.log(error);
			res.status(400).send('error: user not created');
		}
	},

	login: async (req, res) => {
		const { username, password } = req.body;
		console.log('POST login', username, password);

		res.send('New Login');
	},
};

export { post };
