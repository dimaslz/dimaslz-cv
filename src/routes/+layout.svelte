<script lang="ts">
	import { Header } from '@/components';
	import '../app.css';

	export let data: any;

	const isPDFVersion = data.layout.isPdf || false;
</script>

<svelte:head>
	<title>Dimas López resume - @dimaslz</title>
	<meta name="description" content="Dimas López resume - @dimaslz" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
</svelte:head>

<div class="flex flex-col h-full items-center px-4">
	<Header />

	<main class={[!isPDFVersion ? "h-full" : "", "w-full flex justify-center"].join(" ")}>
		<slot />
	</main>

	{#if !isPDFVersion}
		<footer>
			<p class="text-xs p-4 text-gray-600">
				building my resume to play with <span class="text-orange-400">svelte</span> | <a href="https://twitter.com/dimaslz" class="text-blue-400" target="_blank" rel="noreferrer">@dimaslz</a></p>
		</footer>
	{/if}
</div>
