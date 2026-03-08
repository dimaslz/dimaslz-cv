<script lang="ts">
	import { onMount } from 'svelte';
	import { LottiePlayer } from '@/components';
	import { DownloadIcon } from '@/components/icons';
	import type { DimaslzData } from '@/types';
	import { downloadPDF } from '@/utils/download-pdf';

	// oxlint-disable-next-line no-unassigned-vars
	export let data: {
		props: {
			data: DimaslzData;
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

	const container: Element[] = [];
	let firstPageSize = 0;

	const getElementsSize = (elements: Element[]) => {
		return elements.map((e) => e.clientHeight).reduce((a, b) => a + b, 0);
	};

	const loopHTMLElements = (allElements: Element[]) => {
		const size = getElementsSize(allElements);

		if (size > 1040) {
			const last = allElements.pop();
			if (last) {
				container.push(last);
			}

			loopHTMLElements(allElements);
		} else {
			firstPageSize = Number(size);
		}
	};

	onMount(async () => {
		if (!isPDFVersion) return;

		const elements = [...document.querySelectorAll('section > *')];
		loopHTMLElements(elements);

		const section = document.querySelector('section');
		const pageSize = section?.clientHeight || 0;
		const classes = section?.className;
		if (section) {
			document.querySelector('main')?.removeChild(section);
		}
		const newSection = document.createElement('section');
		newSection.id = 'CV';
		if (classes) {
			newSection.className = classes;
		}

		const restSize = 1040 - firstPageSize;

		elements.forEach((e) => {
			newSection.append(e);
		});

		const spaceElement = document.createElement('div');
		if (pageSize > 1040) {
			spaceElement.style.minHeight = `${restSize / 10 + 1}rem`;
			spaceElement.style.height = `${restSize / 10 + 1}rem`;
			newSection.append(spaceElement);
		}

		container.reverse().forEach((e) => {
			newSection.append(e);
		});

		document.querySelector('main')?.append(newSection);
	});

	// Process cover letter text by splitting `<br>` to allow pagination of paragraphs.
	const coverLetterParagraphs = (cvData?.coverLetter || '').split('<br>');
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

	<div class="h-6 w-full"></div>
	<h2 class="text-2xl font-ropa-sans w-full">Cover Letter</h2>
	<div class="h-4 w-full"></div>

	<!-- Render paragraphs individually so that pagination loop() works cleanly -->
	{#each coverLetterParagraphs as paragraph, i (i)}
		{#if paragraph.trim()}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p class="w-full text-xs">{@html paragraph}</p>
			<div class="h-2 w-full"></div>
		{:else}
			<div class="h-4 w-full"></div>
		{/if}
	{/each}
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
