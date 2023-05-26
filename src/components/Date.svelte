<script lang="ts">
	export let date: any;
</script>

<div>
	{#if !['-', 'current'].includes(date.from.month)}
		{date.from.month}
	{/if} {date.from.year} -
	{#if !['-', 'current'].includes(date.to.month)}
		{date.to.month}
	{/if} {date.to.year}
</div>