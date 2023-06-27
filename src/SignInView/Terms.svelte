<script>
	import Button from '../Shared/Button.svelte';

	export let isChecked = false;

	let isOpen = false;

	function toggle() {
		isOpen = !isOpen;
	}
</script>

{#if isOpen}
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
{/if}
<section>
	<h3>
		I agree to the<Button type="button" on:click={toggle}>service terms</Button
		>:
		<input type="checkbox" bind:checked={isChecked} />
	</h3>
</section>

<style>
	section h3 {
		font-weight: inherit;
		font-size: large;
		margin: initial;
	}
</style>
