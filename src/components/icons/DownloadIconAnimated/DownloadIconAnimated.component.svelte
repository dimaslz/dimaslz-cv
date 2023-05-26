<script lang="ts">
	export let play: boolean = false;
	export let loop: boolean = true;
	export let src: string = "";
	export let speed: number = 1;
	export let width: number = 24;

	let ref;

	import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";
	import { browser } from "$app/environment";

	const onProgress = () => {
		console.log("onProgress")
	}
</script>

{#if !browser}
<div></div>
{/if}

{#if browser}
<LottiePlayer
	bind:this={ref}
	speed={speed}
	autoplay={play}
	src={src}
	loop={loop}
	width={width}
/>
{/if}