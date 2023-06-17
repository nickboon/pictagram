<script>
	export let id = 'highlight';
	export let highlight;
	export let selector;

	function onChange(highlight) {
		var elements = document.querySelectorAll(`#${id} ${selector}`);
		elements.forEach((element) => element.classList.remove('highlight'));
		if (highlight !== false) elements[highlight].classList.add('highlight');
	}
	$: onChange(highlight);
</script>

<div {id}>
	<slot />
</div>

<style>
	:global(.highlight) {
		outline: 1px solid #555;
	}
</style>
