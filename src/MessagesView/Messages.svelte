<script>
	import MessageHeader from '../Message/MessageHeader.svelte';
	import MessageBody from '../Message/MessageBody.svelte';

	export let messages = [];
</script>

<ul>
	{#each messages as message}
		<li>
			<article>
				<MessageHeader {message} />
				<MessageBody {message} />
			</article>
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
</style>
