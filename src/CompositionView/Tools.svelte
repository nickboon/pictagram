<script>
	import Symbol from '../Symbol.svelte';
	import Button from '../Util/Button.svelte';

	export let message;
	export let selectedIndex;

	const shiftPx = 10;

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
</script>

<Button on:click={onGrow}><Symbol>+</Symbol></Button>
<Button on:click={onShrink}><Symbol>-</Symbol></Button>
<Button on:click={onShiftLeft}><Symbol>↞︎</Symbol></Button>
<Button on:click={onShiftRight}><Symbol>↠︎</Symbol></Button>
<Button on:click={onShiftUp}><Symbol>↟︎</Symbol></Button>
<Button on:click={onShiftDown}><Symbol>↡︎</Symbol></Button>
<Button on:click={onNudgeLeft}><Symbol>←︎</Symbol></Button>
<Button on:click={onNudgeRight}><Symbol>→︎</Symbol></Button>
<Button on:click={onNudgeUp}><Symbol>↑︎</Symbol></Button>
<Button on:click={onNudgeDown}><Symbol>↓︎</Symbol></Button>
<Button on:click={onRotateCcw}><Symbol>↶︎</Symbol></Button>
<Button on:click={onRotateCw}><Symbol>↷︎</Symbol></Button>
<Button on:click={onFlipX}><Symbol>⬗</Symbol></Button>
<Button on:click={onFlipY}><Symbol>⬘</Symbol></Button>
<Button on:click={onDecreaseOpacity}><Symbol>👻︎</Symbol></Button>
<Button on:click={onDelete}><Symbol>🗑︎</Symbol></Button>
