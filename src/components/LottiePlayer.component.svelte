<script lang="ts">
	export let play: boolean = false;
	export let loop: boolean = true;
	export let src: string = "";
	export let speed: number = 1;
	export let width: number = 24;

	let LottiePlayer: any;

	import { browser } from "$app/environment";
	import { onMount } from "svelte";

	const onProgress = () => {
		console.log("onProgress")
	}
	onMount(async () => {
		console.log("SSDSD", src)
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