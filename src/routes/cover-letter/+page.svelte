<script lang="ts">
	import { page } from '$app/state';
	import { LottiePlayer } from '@/components';
	import { DownloadIcon } from '@/components/icons';
	import { SITE_URL } from '@/constants';
	import type { DimaslzCoverLetterData } from '@/types';
	import { downloadPDF } from '@/utils/download-pdf';

	// oxlint-disable-next-line no-unassigned-vars
	export let data: {
		props: {
			data: DimaslzCoverLetterData;
		};
		layout: {
			isPdf: boolean;
			isDownload: boolean;
		};
	};

	const cvData = data.props.data || {};
	const isPDFVersion = !!data.layout.isPdf;
	let isDownloading = false;

	const TITLE = 'Cover Letter – Dimas López | Engineering Manager & Full-Stack Engineer';
	const DESCRIPTION =
		"Read Dimas López's cover letter — Engineering Manager & Senior Software Engineer in Barcelona with 10+ years of full-stack development experience (React, Node.js, AWS).";
	const canonicalUrl = `${SITE_URL}${page.url.pathname}`;

	const onDownloadPDFHandler = async () => {
		if (isDownloading) return;

		isDownloading = true;

		await downloadPDF('dimas-lopez-zurita-cover-letter');

		isDownloading = false;
	};

	const coverLetterParagraphs = cvData?.coverLetterParagraphs || [];
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<meta itemprop="name" content={TITLE} />
	<meta itemprop="description" content={DESCRIPTION} />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={canonicalUrl} />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<section
	id="CV"
	class="flex min-h-full grow text-sm flex-col container max-w-200 items-center py-8 px-8"
>
	<h1 class="text-4xl flex flex-col w-full font-ropa-sans md:mb-0">
		<span>
			{cvData?.name}
			{cvData?.lastname}
		</span>
	</h1>
	<div class="flex flex-col sm:flex-row w-full mt-2">
		<div class="text-sm uppercase text-slate-600 font-roboto font-light flex">
			{cvData?.title}
		</div>
		<div class="w-full flex sm:items-end sm:justify-end font-light text-xs flex-1 mt-4 sm:mt-0">
			{cvData?.baseOn?.city}, {cvData?.baseOn?.country} - {cvData?.phone} - {cvData?.email}
		</div>
	</div>

	<div class="mt-6 w-full">
		<h2 class="text-2xl font-ropa-sans">Cover Letter</h2>
		<div class="mt-2 space-y-2">
			{#each coverLetterParagraphs as paragraph, i (i)}
				<p class="w-full text-xs break-inside-avoid">{paragraph}</p>
			{/each}
		</div>
	</div>
</section>

{#if !isPDFVersion}
	<a
		href="/"
		class="focus-ring fixed top-4 left-4 flex text-sm p-2 space-x-2 items-center bg-slate-100 hover:bg-slate-200 text-slate-600"
	>
		check my resumé
	</a>

	<button
		on:click={onDownloadPDFHandler}
		disabled={isDownloading}
		aria-live="polite"
		aria-busy={isDownloading}
		class={[
			'focus-ring fixed top-4 right-4 flex text-sm p-2 space-x-2 items-center',
			isDownloading
				? 'bg-slate-50 text-slate-600 cursor-not-allowed'
				: 'download-pdf-animation bg-slate-100 hover:bg-slate-200 text-slate-600',
		].join(' ')}
	>
		{#if !isDownloading}<DownloadIcon size={20} /><span>download pdf version</span>{/if}
		{#if isDownloading}
			<LottiePlayer
				width={20}
				speed={2}
				src="https://assets4.lottiefiles.com/packages/lf20_KlhrNc.json"
				play={true}
			/>
			<span>downloading...</span>
		{/if}
	</button>
{/if}
