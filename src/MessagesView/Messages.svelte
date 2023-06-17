<script>
	import Overlay from '../Shared/Overlay.svelte';
	import Download from './Download.svelte';
	import Message from './Message.svelte';

	export let messenger;
	export let author;
	export let isAbsolutePositioning = true;
	export let messages = [];

	let download;

	function onReactionSent(error) {
		if (error) return console.log(error);
	}

	function onDownload(event) {
		download = event.detail;
		download.downloadedBy.push(author);
		const reaction = {
			messageId: download._id,
			key: 'downloadedBy',
			value: download.downloadedBy,
		};
		messenger.reactToMessage(reaction, onReactionSent);
	}
</script>

{#if download}
	<Overlay>
		<Download bind:message={download} />
	</Overlay>
{/if}
<ul>
	{#each messages as message}
		<li>
			<Message
				{message}
				{author}
				{isAbsolutePositioning}
				{messenger}
				on:download={onDownload}
			/>
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 0;
		list-style-type: none;
		padding: 0;
		text-align: left;
	}
</style>
