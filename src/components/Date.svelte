<script lang="ts">
	import type { Date } from "@/types";

	export let date: {
		from: Date;
		to: Date;
	};
</script>

<div>
	{#if !['-', 'current'].includes(date.from.month)}
		{date.from.month}
	{/if} {date.from.year} -
	{#if !['-', 'current'].includes(date.to.month)}
		{date.to.month}
	{/if} {date.to.year}
</div>