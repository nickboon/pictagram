<script>
	import Message from './Message.svelte';

	export let messenger;
	export let author;
	export let isAbsolutePositioning = true;
	export let messages = [];
</script>

<ul>
	{#each messages as message}
		<li>
			<Message {message} {author} {isAbsolutePositioning} {messenger} />
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
