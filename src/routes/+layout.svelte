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
		<!-- footer -->
		<footer class="mb-12">
			<p class="text-sm p-4 text-gray-600">
				built with ♥️ from Barcelona with <a href="https://kit.svelte.dev/" target="_blank" class="text-orange-600 hover:text-orange-800" rel="noreferrer">svelte</a> | <a href="https://twitter.com/dimaslz" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noreferrer">@dimaslz</a></p>
		</footer>

		<!-- network -->
		<div class="fixed p-4 bottom-0 right-0 flex">
			<a href="https://github.com/dimaslz" class="p-2 text-sm hover:opacity-60 hover:bg-slate-100">gh</a>
			<a href="https://www.linkedin.com/in/dimaslopezzurita" class="p-2 text-sm hover:opacity-60 hover:bg-slate-100">in</a>
			<a href="https://twitter.com/dimaslz" class="p-2 text-sm hover:opacity-60 hover:bg-slate-100">tw</a>
		</div>
	{/if}
</div>
