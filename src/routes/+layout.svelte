<script lang="ts">
	import { Header } from '@/components';
	import '../app.css';

	export let data: any;

	const isPDFVersion = data.layout.isPdf || false;
</script>

<div class="flex flex-col h-full items-center px-4">
	<Header />

	<main class="h-full w-full flex justify-center">
		<slot />
	</main>

	{#if !isPDFVersion}
		<footer>
			<p class="text-xs p-4 text-gray-600">
				building my resume to play with <span class="text-orange-400">svelte</span> | <a href="https://twitter.com/dimaslz" class="text-blue-400" target="_blank" rel="noreferrer">@dimaslz</a></p>
		</footer>
	{/if}
</div>
