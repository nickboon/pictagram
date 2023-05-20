<script>
	export let id = 'outlineSelected';
	export let selected;
	export let selector;

	function onChange(selected) {
		var elements = document.querySelectorAll(`#${id} ${selector}`);
		elements.forEach((element) => element.classList.remove('selected'));
		if (selected !== false) elements[selected].classList.add('selected');
	}
	$: onChange(selected);
</script>

<div {id}>
	<slot />
</div>

<style>
	:global(.selected) {
		outline: 1px solid #555;
	}
</style>
