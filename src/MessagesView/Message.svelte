<script>
	import MessageHeader from '../Message/MessageHeader.svelte';
	import MessageBody from '../Message/MessageBody.svelte';
	import Composition from '../CompositionView/Composition.svelte';
	import Message from '../Message/message';
	import Button from '../Util/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';

	export let message = new Message();
	export let messenger;
	export let author;
	export let isAbsolutePositioning = true;

	let isComposing = false;

	function reply() {
		isComposing = !isComposing;
	}

	function onSubmit() {
		isComposing = false;
	}
</script>

<section>
	<div class="options">
		<Button on:click={reply}><Symbol>↩︎</Symbol></Button>
	</div>
	<article>
		<MessageHeader {message} />
		<MessageBody {message} />
	</article>
	{#if isComposing}
		<Composition
			{messenger}
			{author}
			{isAbsolutePositioning}
			on:submit={onSubmit}
		/>
	{/if}
</section>

<style>
	section {
		padding-top: 1rem;
		position: relative;
	}

	.options {
		display: none;
		position: absolute;
		right: 0;
		top: 1rem;
		z-index: 1;
	}

	section:hover .options {
		display: inline;
	}
</style>
