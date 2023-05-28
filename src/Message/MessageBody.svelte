<script>
	import Symbol from './Symbol.svelte';

	export let message = new Message();

	function style(symbol) {
		return `position:${message.symbolPositions};font-size:${symbol.fontSize}px;opacity:${symbol.opacity};transform: translate(${symbol.x}pt, ${symbol.y}pt) rotate(${symbol.angle}deg) scaleX(${symbol.scaleX}) scaleY(${symbol.scaleY});`;
	}
</script>

<div class="message-body">
	{#each message.body as symbol}
		<Symbol style={style(symbol)}>{symbol.text}</Symbol>
	{/each}
</div>

<style>
	div {
		height: 10rem;
		overflow: hidden;
		padding: 1rem 0.5rem 0.5rem;
		position: relative;
		text-align: left;
	}
</style>
