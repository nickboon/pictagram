<script>
	import Message from './Message.svelte';

	export let isAbsolutePositioning = true;
	export let messages = [];
</script>

<ul>
	{#each messages as message}
		<li>
			<Message {message} {isAbsolutePositioning} on:react on:submit />
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
