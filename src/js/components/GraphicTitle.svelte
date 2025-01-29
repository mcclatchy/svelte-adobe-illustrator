<script>
	export let text;
</script>

<h2 class="g-title g-text">
	{@html text}
</h2>

<style type="text/css">
	.g-title {
		max-width: min(var(--story-width), calc(100vw - 2 * var(--space)));
        margin-left: auto;
        margin-right: auto;
        text-transform: none;
        font-family: var(--g-title-font, var(--serif));
        font-size: 24px;
        font-weight: bold;
        color: var(--text-color);
        margin-bottom: 15px;
	}
</style>