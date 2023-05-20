<script>
	import { blocks } from './unicodeBlock';
	import Symbol from '../Message/Symbol.svelte';
	import SymbolEntity from './SymbolEntity.svelte';
</script>

<ul>
	{#each blocks as block}
		<h3>{block.name}</h3>
		<div>
			{#each block.codes as code}
				<Symbol>
					<SymbolEntity {code} />
				</Symbol>
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
