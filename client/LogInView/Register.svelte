<script>
	import AgreeTerms from './Terms.svelte';
	import Submit from './Submit.svelte';
	import Username from './Username.svelte';
	import Password from './Password.svelte';
	import Validation from './Validation.svelte';
	import ErrorMessage from '../Shared/ErrorMessage.svelte';

	export let isOpen = true;
	export let token = false;

	const message = 'Passwords must match.';

	let isTermsChecked = false;

	async function onSubmit() {
		let data = false;
		try {
			const response = await fetch('/signup', {
				method: 'POST',
				body: JSON.stringify({
					username,
					password,
				}),
				headers: { 'Content-Type': 'application/json' },
			});
			if (response.status === 409) throw new Error('User already registered.');
			if (!response.ok) throw new Error(response.status);
			data = await response.json();
			token = response.headers.get('x-auth-token');
			isOpen = false;
		} catch (error) {
			responseError = error.message;
			if (data.errors) {
				console.error(data.errors);
			}
		}
	}

	let username = '';
	let password = '';
	let confirmPassword = '';
	let isUsernameValid = false;
	let isPasswordValid = false;
	let isConfirmPasswordValid = false;
	let responseError = false;

	$: test = () => password === confirmPassword;
	$: isSubmitDisabled =
		!isTermsChecked ||
		!isUsernameValid ||
		!isPasswordValid ||
		!isConfirmPasswordValid;
</script>

<h2>Register</h2>
<Submit disabled={isSubmitDisabled} on:submit={onSubmit}>
	<section>
		<Validation {message} {test} bind:isValid={isConfirmPasswordValid}>
			<Username bind:value={username} bind:isValid={isUsernameValid} />
			<Password bind:value={password} bind:isValid={isPasswordValid} />
			<Password label="Confirm Password" bind:value={confirmPassword} />
		</Validation>
	</section>
	<AgreeTerms bind:isChecked={isTermsChecked} />
</Submit>
{#if responseError}
	<div><ErrorMessage>Error: {responseError}</ErrorMessage></div>
{/if}

<style>
	section {
		margin-bottom: 2rem;
	}

	:global(button) {
		font-size: inherit;
		font-family: inherit;
	}
</style>
