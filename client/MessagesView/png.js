import domtoimage from 'dom-to-image';

export default class Png {
	static download(message, section) {
		section.querySelector('.reply-to')?.remove();

		domtoimage.toPng(section).then((dataUrl) => {
			const link = document.createElement('a');
			link.download = `${message._id}.png`;
			link.href = dataUrl;
			link.click();
			message = false;
		});
	}
}
