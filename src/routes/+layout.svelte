<script>
	import Header from './Header.svelte';
	import '../app.css';
</script>

<div class="flex flex-col h-full items-center px-4">
	<Header />

	<main class="h-full w-full flex justify-center">
		<slot />
	</main>

	<footer>
		<p class="text-xs p-4 text-gray-600">
			building my resume to play with <span class="text-orange-400">svelte</span> | <a href="https://twitter.com/dimaslz" class="text-blue-400" target="_blank" rel="noreferrer">@dimaslz</a></p>
	</footer>
</div>
