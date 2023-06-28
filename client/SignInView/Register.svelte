<script>
	import AgreeTerms from './Terms.svelte';
	import Submit from './Submit.svelte';
	import Username from './Username.svelte';
	import Password from './Password.svelte';
	import Validation from './Validation.svelte';

	export let isOpen = true;

	const message = 'Passwords must match.';

	let isTermsChecked = false;

	function onSubmit() {
		console.log('registering...');
		isOpen = false;
	}

	let username = '';
	let password = '';
	let confirmPassword = '';
	let isUsernameValid = false;
	let isPasswordValid = false;
	let isConfirmPasswordValid = false;

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

<style>
	section {
		margin-bottom: 2rem;
	}

	/* section h3 {
		font-weight: inherit;
		font-size: large;
		margin: initial;
	} */

	:global(button) {
		font-size: inherit;
		font-family: inherit;
	}
</style>
