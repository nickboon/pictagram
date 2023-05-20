export default class Message {
	constructor(body = []) {
		this.body = body;
		this.date = Date();
	}

	get isEmpty() {
		return this.body.length === 0;
	}
}
