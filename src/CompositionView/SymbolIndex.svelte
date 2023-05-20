<script>
	import { blocks } from './unicodeBlock';
	import Symbol from './Symbol.svelte';
</script>

<ul>
	{#each blocks as block}
		<h3>{block.name}</h3>
		<div>
			{#each block.codes as code}
				<Symbol {code} />
			{/each}
		</div>
	{/each}
</ul>

<style>
	div {
		overflow-wrap: anywhere;
		margin: 2rem 0;
	}
</style>
