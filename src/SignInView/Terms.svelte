<script>
	import Button from '../Util/Button.svelte';

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
	<h3>
		<Button type="submit" on:click={close}>
			<span class="primary symbol">✔︎</span>
		</Button>
	</h3>
</section>

<style>
	.primary {
		color: #ff3e00;
		font-size: larger;
	}
</style>
