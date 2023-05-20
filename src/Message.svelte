<script>
	import Symbol from './Symbol.svelte';
	import Message from './message';

	export let message = new Message();

	function style(symbol) {
		return `font-size:${symbol.fontSize}px;opacity:${symbol.opacity};transform: translate(${symbol.x}pt, ${symbol.y}pt) rotate(${symbol.angle}deg) scaleX(${symbol.scaleX}) scaleY(${symbol.scaleY});`;
	}
</script>

<article>
	{#each message.symbols as symbol}
		<Symbol style={style(symbol)}>{symbol.text}</Symbol>
	{/each}
</article>

<style>
	article {
		height: 10rem;
		margin: 0.5rem 0 2rem;
		overflow: hidden;
		padding: 0.5rem;
		text-align: left;
	}
</style>
