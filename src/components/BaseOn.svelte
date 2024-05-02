<script lang="ts">
	import type { BaseOn } from "@/types";

	export let data: BaseOn;
</script>

<div>
	{data.city}, {data.country} {#if data.mode} ({data.mode}){/if}
</div>