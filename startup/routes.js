export default function (app, messageStore) {
	app.get('/api/message/:id', (request, response) => {
		messageStore
			.getById(request.params.id)
			.then((message) => {
				if (!message) return response.status(404).send();
				response.send(message);
			})
			.catch(() => response.status(500).send());
	});
}
