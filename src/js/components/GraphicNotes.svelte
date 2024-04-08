<script>
	export let text;
</script>

<p class="g-notes g-text caption">
	{@html text}
</p>

<style type="text/css">
	.g-notes {
    font: 400 .875rem / 1.4em var(--sans);
    color: var(--caption-color, var(--secondary-text-color));
	}
</style>