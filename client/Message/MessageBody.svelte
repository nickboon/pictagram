<script>
	import Symbol from './Symbol.svelte';
	import Message from './message';

	export let message = new Message();
	export let symbolElements = [];

	function getInvertFilter(symbol) {
		return symbol.isInverted ? 'color:white' : '';
	}

	function style(symbol) {
		return `position:${message.symbolPositions};font-size:${
			symbol.fontSize
		}px;opacity:${symbol.opacity};transform: translate(${symbol.x}px,${
			symbol.y
		}px) rotate(${symbol.angle}deg) scaleX(${symbol.scaleX}) scaleY(${
			symbol.scaleY
		});${getInvertFilter(symbol)}`;
	}
</script>

<div class="message-body">
	{#each message.body as symbol, index}
		<Symbol style={style(symbol)} bind:symbolElement={symbolElements[index]}>
			{symbol.text}
		</Symbol>
	{/each}
</div>

<style>
	div {
		height: 11rem;
		overflow: hidden;
		margin: 1rem 0 0.5rem;
		position: relative;
		text-align: left;
	}
</style>
