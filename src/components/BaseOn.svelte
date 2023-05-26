<script lang="ts">
	export let data: any;
</script>

<div>
	{data.city}, {data.country} {#if data.mode} ({data.mode}){/if}
</div>