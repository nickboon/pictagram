<script>
	import Submit from './Submit.svelte';

	export let isOpen = true;

	function close() {
		isOpen = false;
	}
</script>

<h2>Pictagram Terms</h2>
<Submit on:submit={close}>
	<section>
		<p>
			This service was created as part of an application for inclusion in an art
			exhibition.
		</p>
		<p>
			By continuing to access the site and use the service you agree that any
			submitted content or metadata gathered about the content may be used as
			part of an art exhibition.
		</p>
		<p>For more information contact me at boonnick at hotmail dot com.</p>
	</section>
</Submit>
