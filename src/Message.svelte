<script>
	import Message from './message';

	export let message = new Message();
	export let group;

	$: grouped = function (index) {
		return group === index ? ` grouped` : '';
	};
</script>

<div class="positionable_container">
	{#each message.symbols as symbol, index}
		<span
			class="symbol{grouped(index)}"
			style="font-size:{symbol.fontSize}px;opacity:{symbol.opacity};transform: translate({symbol.x}pt, {symbol.y}pt) rotate({symbol.angle}deg) scaleX({symbol.scaleX}) scaleY({symbol.scaleY});"
			>{symbol.text}</span
		>
	{/each}
</div>

<style>
	.positionable_container {
		height: 10rem;
		outline: 1px solid #555;
		overflow: hidden;
		padding: 0.5rem;
		text-align: left;
		margin-bottom: 0.5rem;
	}

	.grouped {
		outline: 1px solid #555;
	}
</style>
