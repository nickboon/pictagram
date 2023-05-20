<script>
	import Message from '../Message.svelte';

	export let messages = [];
</script>

<ul>
	{#each messages as message}
		<li>
			<time>{message.date.toString().slice(0, 24)}</time>
			<Message {message} />
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none;
		margin-top: 1.5rem;
		border-top: 1px solid #555;
		text-align: left;
		padding: 1rem 0;
	}

	li {
		margin-top: 1rem;
	}

	time {
		font-family: monospace;
		font-size: xx-small;
	}
</style>
