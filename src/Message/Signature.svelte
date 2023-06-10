<script>
	import Message from './message';

	export let date;
	export let authors;
</script>

<time datetime={date}>
	{new Date(date).toString().slice(0, 24)}
</time>
<address>{authors}</address>

<style>
	address {
		display: inline;
	}
</style>
