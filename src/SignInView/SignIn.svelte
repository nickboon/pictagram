<script>
	import Register from './Register.svelte';
	import Button from '../Shared/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';
	import Submit from './Submit.svelte';
	import Username from './Username.svelte';
	import Password from './Password.svelte';

	export let author = false;
	export let isAbsolutePositioning = true;

	let isAnonymous = false;
	let username = '';
	let isUsernameValid = false;
	let isRegistrationOpen = false;

	function openRegistration() {
		isRegistrationOpen = true;
	}

	function format(value) {
		return value.replace(/[\s]/, ' ').trim();
	}

	function toggleAnonymous() {
		isAnonymous = !isAnonymous;
	}

	function toggleAbsolutePositioning() {
		isAbsolutePositioning = !isAbsolutePositioning;
	}

	function onSubmit() {
		author = format(username); // this can be done in schema
	}

	$: isSubmitDisabled = !isAnonymous && !isUsernameValid;
</script>

{#if !isRegistrationOpen}
	<Submit disabled={isSubmitDisabled} on:submit={onSubmit}>
		<h2 class="symbol">⚙︎</h2>
		<section>
			<h3>Authenticate as:</h3>
			Registered User
			<Button type="button" on:click={toggleAnonymous}>
				<Symbol>{!isAnonymous ? '👈︎' : '👉︎'}</Symbol>
			</Button>
			Anonymous
			<p>
				or <Button type="button" on:click={openRegistration}>
					<em>Sign Up</em>
				</Button>.
			</p>
		</section>
		{#if !isAnonymous}
			<section>
				<Username bind:value={username} bind:isValid={isUsernameValid} />
			</section>
		{/if}
		<section>
			<h3>Select character positioning:</h3>
			Absolute
			<Button type="button" on:click={toggleAbsolutePositioning}>
				<Symbol>{isAbsolutePositioning ? '👈︎' : '👉︎'}</Symbol>
			</Button>
			Relative
		</section>
		<section>
			<h3>Instructions:</h3>
			<ul>
				<li>Click on a character to start composing a new post,</li>
				<li>
					or reply to
					<Symbol>↩︎</Symbol>
					or recycle
					<Symbol>♻︎</Symbol>
					an existing post.
				</li>
			</ul>
		</section>
	</Submit>
{:else}
	<Register bind:isOpen={isRegistrationOpen} />
{/if}

<style>
	section {
		margin-bottom: 2rem;
	}

	p {
		margin: 0;
	}
	section h3 {
		font-weight: inherit;
		font-size: large;
		margin: initial;
	}
	ul {
		margin: 0;
		list-style-type: none;
		padding: 0;
	}
</style>
