<script>
	import Button from '../Shared/Button.svelte';
	import Terms from './Terms.svelte';
	import Submit from './Submit.svelte';
	import Username from './Username.svelte';
	import Password from './Password.svelte';
	import Validation from './Validation.svelte';

	export let isOpen = true;

	let isTermsChecked = false;
	let isTermsOpen = false;
	let username = '';
	let password = '';
	let confirmPassword = '';

	function openTerms() {
		isTermsOpen = true;
	}

	function onSubmit() {
		console.log('registering...');
		isOpen = false;
	}

	let isUsernameValid = false;
	let isPasswordValid = false;
	let isDirty = false;

	function onChange(confirmPassword) {
		if (isDirty) return isPasswordValid && password === confirmPassword;
		isDirty = true;
	}

	$: isRepeatPasswordValid = onChange(confirmPassword);
	$: isSubmitDisabled =
		!isTermsChecked || !isUsernameValid || !isRepeatPasswordValid;
</script>

{#if !isTermsOpen}
	<h2>Register</h2>
	<Submit disabled={isSubmitDisabled} on:submit={onSubmit}>
		<section>
			<Username bind:value={username} bind:isValid={isUsernameValid} />
			<Password bind:value={password} bind:isValid={isPasswordValid} />
			<Password label="Confirm Password" bind:value={confirmPassword} />
			<Validation isValid={isRepeatPasswordValid}>
				Passwords must match.
			</Validation>
		</section>
		<section>
			<h3>
				I agree to the<Button type="button" on:click={openTerms}>
					service terms
				</Button>:
				<input type="checkbox" bind:checked={isTermsChecked} />
			</h3>
		</section>
	</Submit>
{:else}
	<Terms bind:isOpen={isTermsOpen} />
{/if}

<style>
	section {
		margin-bottom: 2rem;
	}

	section h3 {
		font-weight: inherit;
		font-size: large;
		margin: initial;
	}

	:global(button) {
		font-size: inherit;
		font-family: inherit;
	}
</style>
