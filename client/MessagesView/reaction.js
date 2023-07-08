export default class Reaction {
	static get actions() {
		return {
			downloaded: 'downloaded',
		};
	}
	constructor(action, message) {
		this.action = action;
		this.message = message;
	}
}
