<script>
	import Button from '../Shared/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';

	export let isOpen = true;

	function close() {
		isOpen = false;
	}
</script>

<h2>Pictagram Terms</h2>
<section />
<p>
	This service was created as part of an application for inclusion in an art
	exhibition.
</p>
<p>
	By continuing to access the site and use the service you agree that any
	submitted content or metadata gathered about the content may be used as part
	of an art exhibition.
</p>
<p>For more information contact me at boonnick at hotmail dot com.</p>

<section>
	<h3 class="submit">
		<Button type="submit" on:click={close}>
			<Symbol>✔︎</Symbol>
		</Button>
	</h3>
</section>

<style>
	.submit :global(button) {
		font-size: larger;
		color: green;
	}

	.submit :global(button):hover {
		outline: 1px solid green;
	}
</style>
