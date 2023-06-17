<script>
	import symbolObject from '../Message/symbol';
	import Symbol from '../Message/Symbol.svelte';
	import Button from '../Util/Button.svelte';

	export let message;
	export let selectedIndex;

	const shiftPx = symbolObject.default.fontSize;

	let underline = false;

	function onDelete() {
		message.body = message.body.filter(
			(symbol) => symbol != message.body[selectedIndex]
		);
	}

	function onNudgeLeft() {
		message.body[selectedIndex].x--;
	}

	function onNudgeRight() {
		message.body[selectedIndex].x++;
	}

	function onNudgeUp() {
		message.body[selectedIndex].y--;
	}

	function onNudgeDown() {
		message.body[selectedIndex].y++;
	}

	function onShiftLeft() {
		message.body[selectedIndex].x -= shiftPx;
	}

	function onShiftRight() {
		message.body[selectedIndex].x += shiftPx;
	}

	function onShiftUp() {
		message.body[selectedIndex].y -= shiftPx;
	}

	function onShiftDown() {
		message.body[selectedIndex].y += shiftPx;
	}

	function onRotateCw() {
		message.body[selectedIndex].angle += underline ? 90 : 1;
	}
	function onRotateCcw() {
		message.body[selectedIndex].angle -= underline ? 90 : 1;
	}

	function onGrow() {
		message.body[selectedIndex].fontSize += underline ? shiftPx : 1;
	}

	function onShrink() {
		message.body[selectedIndex].fontSize -= underline ? shiftPx : 1;
	}

	function toggleAlt() {
		underline = !underline;
	}

	function onFlipX() {
		message.body[selectedIndex].scaleX *= -1;
	}

	function onFlipY() {
		message.body[selectedIndex].scaleY *= -1;
	}

	function toggleInvert() {
		message.body[selectedIndex].isInverted =
			!message.body[selectedIndex].isInverted;
	}

	function onDecreaseOpacity() {
		message.body[selectedIndex].opacity =
			message.body[selectedIndex].opacity <= 0.2
				? 1
				: message.body[selectedIndex].opacity - 0.1;
	}
</script>

<Button on:click={onShiftLeft}><Symbol>↞︎</Symbol></Button>
<Button on:click={onShiftRight}><Symbol>↠︎</Symbol></Button>
<Button on:click={onShiftUp}><Symbol>↟︎</Symbol></Button>
<Button on:click={onShiftDown}><Symbol>↡︎</Symbol></Button>
<Button on:click={onNudgeLeft}><Symbol>←︎</Symbol></Button>
<Button on:click={onNudgeRight}><Symbol>→︎</Symbol></Button>
<Button on:click={onNudgeUp}><Symbol>↑︎</Symbol></Button>
<Button on:click={onNudgeDown}><Symbol>↓︎</Symbol></Button>
<span class:underline>
	<Button on:click={onRotateCcw}><Symbol>↶︎</Symbol></Button>
	<Button on:click={onRotateCw}><Symbol>↷︎</Symbol></Button>
	<Button on:click={onGrow}><Symbol>+</Symbol></Button>
	<Button on:click={onShrink}><Symbol>-</Symbol></Button>
</span>
<Button on:click={toggleAlt}><Symbol>⌥︎</Symbol></Button>
<Button on:click={onFlipX}><Symbol>⬗</Symbol></Button>
<Button on:click={onFlipY}><Symbol>⬘</Symbol></Button>
<Button on:click={toggleInvert}><Symbol>◐︎</Symbol></Button>
<Button on:click={onDecreaseOpacity}><Symbol>👻︎</Symbol></Button>
<Button on:click={onDelete}><Symbol>🗑︎</Symbol></Button>

<style>
	.underline :global(.symbol) {
		text-decoration: underline;
	}
</style>
