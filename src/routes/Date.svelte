<script lang="ts">
	export let date: any;
</script>

<div>
	<span>
		{['-', 'current'].includes(date.from.month) ? '' : date.from.month} {date.from.year} - {['-', 'current'].includes(date.to.month) ? '' : date.to.month} {date.to.year}
	</span>
</div>