export default class Message {
	constructor(authors = ['anon'], body = []) {
		this.authors = authors;
		this.body = body;
	}

	get isEmpty() {
		return this.body.length === 0;
	}
}
