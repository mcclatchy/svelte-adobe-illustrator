<script>
	export let text;
</script>

<p class="g-description g-text">
	{@html text}
</p>

<style type="text/css">
	.g-description {
		margin: 0;
		max-width: min(var(--story-width), calc(100vw - 2 * var(--space)));
		margin-left: auto;
		margin-right: auto;
		font-family: var(--g-subtitle-font, var(--sans));
		font-weight: normal;
		font-size: 16px;
		line-height: 22px;
		color: var(--g-subtitle-color, var(--text-color));
		margin-bottom: var(--g-subtitle-margin-bottom, 15px);
	}
</style>