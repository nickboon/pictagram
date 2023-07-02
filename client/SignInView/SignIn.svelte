<script>
	import Register from './Register.svelte';
	import Button from '../Shared/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';
	import Submit from './Submit.svelte';
	import Radio from './Radio.svelte';
	import Username from './Username.svelte';
	import AgreeTerms from './Terms.svelte';

	export let author = false;
	export let token = false;
	export let isAbsolutePositioning = true;

	let isTermsChecked = false;

	let isRegistered = true;
	let username = '';
	let isUsernameValid = false;
	let isRegistrationOpen = false;

	function openRegistration() {
		isRegistrationOpen = true;
	}

	function format(value) {
		return value.replace(/[\s]/, ' ').trim();
	}

	function onSubmit() {
		author = format(username); // this can be done in schema
	}

	$: isSubmitDisabled =
		(isRegistered && !isUsernameValid) || (!isRegistered && !isTermsChecked);
</script>

{#if !isRegistrationOpen}
	<Submit disabled={isSubmitDisabled} on:submit={onSubmit}>
		<h2 class="symbol">⚙︎</h2>
		<section>
			<h3>Authenticate as:</h3>
			<Radio a={'Registered User'} b={'Anonymous'} bind:is={isRegistered} />
			<p>
				or <Button type="button" on:click={openRegistration}>
					<em>Sign Up</em>
				</Button>.
			</p>
		</section>
		{#if isRegistered}
			<section>
				<Username bind:value={username} bind:isValid={isUsernameValid} />
			</section>
		{/if}
		<section>
			<h3>Select character positioning:</h3>
			<Radio a={'Absolute'} b={'Relative'} bind:is={isAbsolutePositioning} />
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
		{#if !isRegistered}
			<AgreeTerms bind:isChecked={isTermsChecked} />
		{/if}
	</Submit>
{:else}
	<Register bind:isOpen={isRegistrationOpen} bind:author bind:token />
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
