<script>
	import Button from '../Shared/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';

	export let disabled = false;
</script>

<form on:submit|preventDefault>
	<slot />
	<section>
		<h3>
			<Button type="submit" {disabled} on:click>
				<Symbol>✔︎</Symbol>
			</Button>
		</h3>
	</section>
</form>

<style>
	section {
		margin-bottom: 2rem;
	}

	h3 :global(button) {
		font-size: larger;
		color: green;
	}

	h3 :global(button):hover {
		outline: 1px solid green;
	}
</style>
