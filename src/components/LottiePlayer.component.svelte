<script lang="ts">
	export let play = false;
	export let loop = true;
	export let src = "";
	export let speed = 1;
	export let width = 24;

	let LottiePlayer: any;

	import { browser } from "$app/environment";
	import { onMount } from "svelte";

	onMount(async () => {
		if (browser) {
			const SvelteLottie = await import("@lottiefiles/svelte-lottie-player");
			LottiePlayer = SvelteLottie.LottiePlayer;
		}
	})
</script>

{#if !browser}
<div></div>
{/if}

{#if browser && LottiePlayer}
<svelte:component
	this={LottiePlayer}
	speed={speed}
	autoplay={play}
	src={src}
	loop={loop}
	width={width}
	background={false}
/>
{/if}