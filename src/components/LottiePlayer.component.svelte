<script lang="ts">
	export let play = false;
	export let loop = true;
	export let src = '';
	export let speed = 1;
	export let width = 24;

	let LottiePlayer: any;

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (browser) {
			const SvelteLottie = await import('@lottiefiles/svelte-lottie-player');
			LottiePlayer = SvelteLottie.LottiePlayer;
		}
	});
</script>

<span aria-hidden="true" class="inline-flex">
	{#if !browser}
		<div></div>
	{/if}

	{#if browser && LottiePlayer}
		{@const Component = LottiePlayer}
		<Component
			this={LottiePlayer}
			{speed}
			autoplay={play}
			{src}
			{loop}
			{width}
			background={false}
		/>
	{/if}
</span>
