<script>
	import Terms from './Terms.svelte';
	import Button from '../Util/Button.svelte';

	export let author = false;
	export let isAbsolutePositioning = true;
	export let isTermsChecked = false;

	let value = '';
	let isTermsOpen = false;

	function format(value) {
		return value.replace(/[\s]/, ' ').trim();
	}

	function toggleAbsolutePositioning() {
		isAbsolutePositioning = !isAbsolutePositioning;
	}

	function openTerms() {
		isTermsOpen = true;
	}

	function onSubmit() {
		author = format(value);
	}

	$: isValid = value.match(/^[a-zA-Z0-9_.-@ ]*$/);
	$: isSubmitDisabled = !isTermsChecked || !isValid;
</script>

{#if !isTermsOpen}
	<form on:submit|preventDefault={onSubmit}>
		<h2 class="symbol">⚙︎</h2>
		<section>
			<h3>Username:</h3>
			<input type="text" name="username" bind:value />
			<div id="validation" class:isValid>
				Valid characters: a-z, A-Z, 0-9, _, ., - and @.
			</div>
		</section>
		<section>
			<h3>Select Character positioning:</h3>
			Absolute
			<Button type="button" on:click={toggleAbsolutePositioning}>
				<span class="symbol">{isAbsolutePositioning ? '👈︎' : '👉︎'}</span>
			</Button>
			Relative
		</section>
		<section>
			<h3>
				I agree to the<Button type="button" on:click={openTerms}>
					service terms
				</Button>:
				<input type="checkbox" bind:checked={isTermsChecked} />
			</h3>
		</section>
		<section>
			<h3>
				<Button type="submit" disabled={isSubmitDisabled}>
					<span class="primary symbol">✔︎</span>
				</Button>
			</h3>
		</section>
	</form>
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

	#validation {
		color: red;
	}

	#validation.isValid {
		display: none;
	}

	.primary {
		color: #ff3e00;
		font-size: larger;
	}
</style>
