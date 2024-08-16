<script>
	import CanvasApp from './CanvasApp.svelte';
	import PenVisApp from './PenVisApp.svelte';

	let penVisEnabled = true;
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'p') penVisEnabled = !penVisEnabled;
	}}
/>

<CanvasApp />
{#if penVisEnabled}<PenVisApp />{/if}
