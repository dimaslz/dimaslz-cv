<script lang="ts">
	import { Header } from '@/components';
	import '../app.css';

	// oxlint-disable-next-line no-unassigned-vars
	export let data: {
		layout: { isPdf: boolean };
	};

	const isPDFVersion = data.layout.isPdf || false;
</script>

<div class="flex flex-col h-full items-center px-4">
	<a
		href="#main-content"
		class="focus-ring sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-2 focus:shadow"
	>
		Skip to content
	</a>

	<Header />

	<main
		id="main-content"
		class={[!isPDFVersion ? 'h-full' : '', 'w-full flex justify-center'].join(' ')}
	>
		<slot />
	</main>

	{#if !isPDFVersion}
		<!-- footer -->
		<footer class="mb-12">
			<p class="text-sm p-4 text-gray-600">
				built with ♥️ from Barcelona with <a
					href="https://kit.svelte.dev/"
					target="_blank"
					class="focus-ring text-orange-600 hover:text-orange-800"
					rel="noreferrer">svelte</a
				>
				|
				<a
					href="https://twitter.com/dimaslz"
					class="focus-ring text-blue-600 hover:text-blue-800"
					target="_blank"
					rel="noreferrer">@dimaslz</a
				>
			</p>
		</footer>

		<!-- network -->
		<nav aria-label="social links" class="fixed p-4 bottom-0 right-0 flex">
			<a
				href="https://github.com/dimaslz"
				target="_blank"
				rel="noreferrer"
				aria-label="GitHub"
				class="focus-ring p-2 text-sm hover:opacity-60 hover:bg-slate-100">gh</a
			>
			<a
				href="https://www.linkedin.com/in/dimaslopezzurita"
				target="_blank"
				rel="noreferrer"
				aria-label="LinkedIn"
				class="focus-ring p-2 text-sm hover:opacity-60 hover:bg-slate-100">in</a
			>
			<a
				href="https://twitter.com/dimaslz"
				target="_blank"
				rel="noreferrer"
				aria-label="Twitter"
				class="focus-ring p-2 text-sm hover:opacity-60 hover:bg-slate-100">tw</a
			>
		</nav>
	{/if}
</div>
