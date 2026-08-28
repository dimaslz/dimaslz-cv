<script lang="ts">
	import { LottiePlayer } from '@/components';
	import { DownloadIcon } from '@/components/icons';
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

	const onDownloadPDFHandler = async () => {
		if (isDownloading) return;

		isDownloading = true;

		await downloadPDF('dimas-lopez-zurita-cover-letter');

		isDownloading = false;
	};

	const coverLetterParagraphs = cvData?.coverLetterParagraphs || [];
</script>

<section
	id="CV"
	class="flex min-h-full flex-grow text-sm flex-col container max-w-[800px] items-center py-8 px-8"
>
	<h1 class="text-4xl flex flex-col w-full font-ropa-sans md:mb-0">
		<span>
			{cvData?.name}
			{cvData?.lastname}
		</span>
	</h1>
	<div class="flex flex-col sm:flex-row w-full mt-2">
		<div class="text-sm uppercase text-slate-500 font-roboto font-light flex">
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
		class="fixed top-4 left-4 flex text-sm p-2 space-x-2 items-center bg-slate-100 hover:bg-slate-200 text-slate-600"
	>
		check my resumé
	</a>

	<button
		on:click={onDownloadPDFHandler}
		disabled={isDownloading}
		class={[
			'fixed top-4 right-4 flex text-sm p-2 space-x-2 items-center',
			isDownloading
				? 'bg-slate-50 text-slate-400 cursor-not-allowed'
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
