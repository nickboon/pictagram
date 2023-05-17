<script>
	import Button from './Button.svelte';
	import Message from './message';

	export let message = new Message();
	export let group = false;

	const shiftPx = 10;

	let selectedIndex = 0;

	function onDelete() {
		message.symbols = message.symbols.filter(
			(symbol) => symbol != message.symbols[selectedIndex]
		);
	}

	function onGrow() {
		message.symbols[selectedIndex].fontSize++;
	}

	function onShrink() {
		message.symbols[selectedIndex].fontSize--;
	}

	function onNudgeLeft() {
		message.symbols[selectedIndex].x--;
	}

	function onNudgeRight() {
		message.symbols[selectedIndex].x++;
	}

	function onNudgeUp() {
		message.symbols[selectedIndex].y--;
	}

	function onNudgeDown() {
		message.symbols[selectedIndex].y++;
	}

	function onShiftLeft() {
		message.symbols[selectedIndex].x -= shiftPx;
	}

	function onShiftRight() {
		message.symbols[selectedIndex].x += shiftPx;
	}

	function onShiftUp() {
		message.symbols[selectedIndex].y -= shiftPx;
	}

	function onShiftDown() {
		message.symbols[selectedIndex].y += shiftPx;
	}

	function onRotateCw() {
		message.symbols[selectedIndex].angle++;
	}
	function onRotateCcw() {
		message.symbols[selectedIndex].angle--;
	}

	function onFlipX() {
		message.symbols[selectedIndex].scaleX *= -1;
	}

	function onFlipY() {
		message.symbols[selectedIndex].scaleY *= -1;
	}

	function onDecreaseOpacity() {
		message.symbols[selectedIndex].opacity =
			message.symbols[selectedIndex].opacity <= 0.2
				? 1
				: message.symbols[selectedIndex].opacity - 0.1;
	}

	function setSelected(index) {
		selectedIndex = index;
		message.symbols.map((symbol) => (symbol.isSelected = false));
		message.symbols[index].isSelected = true;
	}

	function onMouseenter(index) {
		group = index;
	}

	function onMouseleave() {
		group = false;
	}

	function onChange(messageLength) {
		if (messageLength) setSelected(messageLength - 1);
	}

	$: messageLength = message.symbols.length;
	$: onChange(messageLength);
</script>

{#if messageLength > 0}
	<div class="toolbar">
		<ul>
			{#each message.symbols as symbol, index}
				<li>
					<Button
						selected={symbol.isSelected}
						on:click={() => {
							setSelected(index);
						}}
						on:mouseenter={() => {
							onMouseenter(index);
						}}
						on:mouseleave={onMouseleave}
					>
						<span class="symbol">{symbol.text}</span>
					</Button>
				</li>
			{/each}
		</ul>
		<span class="spacer" />
		<div class="tools">
			<Button on:click={onGrow}>+</Button>
			<Button on:click={onShrink}>-</Button>
			<Button on:click={onShiftLeft}>↞︎</Button>
			<Button on:click={onShiftRight}>↠︎</Button>
			<Button on:click={onShiftUp}>↟︎</Button>
			<Button on:click={onShiftDown}>↡︎</Button>
			<Button on:click={onNudgeLeft}>←︎</Button>
			<Button on:click={onNudgeRight}>→︎</Button>
			<Button on:click={onNudgeUp}>↑︎</Button>
			<Button on:click={onNudgeDown}>↓︎</Button>
			<Button on:click={onRotateCcw}>↶︎</Button>
			<Button on:click={onRotateCw}>↷︎</Button>
			<Button on:click={onFlipX}>⬗</Button>
			<Button on:click={onFlipY}>⬘</Button>
			<Button on:click={onDecreaseOpacity}>👻︎</Button>
			<Button on:click={onDelete}>🗑︎</Button>
		</div>
	</div>
{/if}

<style>
	ul {
		list-style-type: none;
		overflow-x: auto;
	}

	ul,
	li,
	.tools {
		display: inline;
	}

	.toolbar {
		margin-bottom: 1rem;
	}

	.spacer {
		margin: 0 1rem;
	}
	.spacer::after {
		content: '|';
	}
</style>
