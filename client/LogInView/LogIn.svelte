<script>
	import Register from './Register.svelte';
	import Button from '../Shared/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';
	import Submit from './Submit.svelte';
	import Radio from './Radio.svelte';
	import Username from './Username.svelte';
	import Password from './Password.svelte';
	import ErrorMessage from '../Shared/ErrorMessage.svelte';
	import AgreeTerms from './Terms.svelte';

	export let isOpen = true;
	export let token = false;
	export let isAbsolutePositioning = true;

	let isTermsChecked = false;

	let isRegistered = true;
	let username = '';
	let password = '';
	let isUsernameValid = false;
	let isPasswordValid = false;
	let responseError = '';
	let isRegistrationOpen = false;

	function openRegistration() {
		isRegistrationOpen = true;
	}

	async function onSubmit() {
		if (!isRegistered) {
			isOpen = false;
			return;
		}

		try {
			const response = await fetch('/login', {
				method: 'POST',
				body: JSON.stringify({
					username,
					password,
				}),
				headers: { 'Content-Type': 'application/json' },
			});
			if (response.status === 400) throw new Error('Invalid credentials.');
			if (!response.ok) throw new Error('Login failed.');
			token = response.headers.get('x-auth-token');
			responseError = '';
			isOpen = false;
		} catch (error) {
			responseError = error.message;
		}
	}

	function onChange(token) {
		if (token) isOpen = false;
	}

	$: onChange(token);

	$: isSubmitDisabled =
		(isRegistered && (!isUsernameValid || !isPasswordValid)) ||
		(!isRegistered && !isTermsChecked);
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
				<Password bind:value={password} bind:isValid={isPasswordValid} />
				{#if responseError}
					<ErrorMessage>Error: {responseError}</ErrorMessage>
				{/if}
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
	<Register bind:isOpen={isRegistrationOpen} bind:token />
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
