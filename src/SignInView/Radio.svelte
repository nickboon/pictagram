<script>
	import Button from '../Shared/Button.svelte';
	import Symbol from '../Message/Symbol.svelte';

	export let a = '';
	export let b = '';
	export let is = true;

	function toggle() {
		is = !is;
	}
</script>

{a}
<Button type="button" on:click={toggle}>
	<Symbol>{is ? '👈︎' : '👉︎'}</Symbol>
</Button>
{b}
