<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { BaseOn, Date, LottiePlayer } from '@/components';
	import { DownloadIcon } from '@/components/icons';
	import { CV_WIDTH, SITE_URL } from '@/constants';
	import type { DimaslzViewData } from '@/types';
	import { downloadPDF } from '@/utils/download-pdf';

	// oxlint-disable-next-line no-unassigned-vars
	export let data: {
		props: {
			data: DimaslzViewData;
		};
		layout: {
			isPdf: boolean;
			isDownload: boolean;
		};
	};

	const cvData = data.props.data || {};
	const isPDFVersion = !!data.layout.isPdf;
	const isDownload = !!data.layout.isDownload;
	let isDownloading = false;

	const TITLE = 'Dimas López – Engineering Manager & Full-Stack Engineer';
	const DESCRIPTION =
		'Dimas López — Engineering Manager & Senior Software Engineer in Barcelona, 10+ years in full-stack dev (React, Node.js, AWS). View his online CV.';
	const canonicalUrl = `${SITE_URL}${page.url.pathname}`;
	const personJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: `${cvData?.name} ${cvData?.lastname}`,
		jobTitle: cvData?.title,
		url: SITE_URL,
		sameAs: [cvData?.network?.github, cvData?.network?.linkedin, cvData?.network?.twitter].filter(
			Boolean,
		),
	};
	const personJsonLdMarkup = `<script type="application/ld+json">${JSON.stringify(
		personJsonLd,
	).replace(/</g, '\\u003c')}<\/script>`;

	const downloadPdf = async () => {
		if (isDownloading) return;

		isDownloading = true;

		await downloadPDF('dimas-lopez-zurita-resume');

		isDownloading = false;
	};

	let showButtons = false;
	let isLessThanCV = false;

	const widthIsLessThanCV = () => document.documentElement.offsetWidth < CV_WIDTH;

	const onScrollHandler = () => {
		showButtons =
			isLessThanCV && (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150);
	};

	const onResizeHandler = () => {
		isLessThanCV = widthIsLessThanCV();
	};

	onMount(async (): Promise<any> => {
		if (isDownload) {
			await downloadPdf();
			window.history.pushState({}, '', '/');
		}

		if (isPDFVersion) return;

		isLessThanCV = widthIsLessThanCV();

		document.addEventListener('scroll', onScrollHandler);
		window.addEventListener('resize', onResizeHandler);

		return () => {
			document.removeEventListener('scroll', onScrollHandler);
			window.removeEventListener('resize', onResizeHandler);
		};
	});
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
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html personJsonLdMarkup}
</svelte:head>

<section
	id="CV"
	class="flex min-h-full grow text-sm flex-col container max-w-200 items-center p-8 text-left w-full"
>
	{#if isDownloading}
		<div class="h-full w-full absolute inset-0 flex items-center justify-center z-0">
			<div
				class="text-lg bg-slate-200 p-6 flex items-center justify-center transition-all delay-150 duration-500 animate-bounce"
			>
				Downloading online CV in a PDF version
			</div>
		</div>
	{/if}

	<h1 class="text-4xl flex flex-col w-full font-ropa-sans md:mb-0">
		<span>
			{cvData?.name}
			{cvData?.lastname}
		</span>
	</h1>

	<div class="text-sm uppercase text-gray-600 font-roboto font-light flex text-left w-full">
		{cvData?.title}
	</div>
	<div class="w-full flex items-end justify-end font-light text-xs flex-1 mt-4 sm:mt-0 leading-5">
		{cvData?.baseOn?.city}, {cvData?.baseOn?.country} - {cvData?.phone} - {cvData?.email}
	</div>

	<h2 class="text-2xl font-ropa-sans w-full text-left">Profile</h2>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<p class="text-xs mt-2">{@html cvData?.introduction}</p>

	<h2 class="text-2xl font-ropa-sans w-full text-left pt-4 pb-2">Employment History</h2>

	<ul class="w-full space-y-4">
		<!-- TODO: resolve use key -->
		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each (cvData?.jobs || []) as job}
			<li class="break-inside-avoid">
				{#if 'carrier' in job}
					<h3 class="text-base font-bold w-full text-left">{job.company}</h3>
					<ul class="space-y-2">
						<!-- eslint-disable-next-line svelte/require-each-key -->
						{#each job.promotions as promotion}
							<li class="break-inside-avoid">
								<h4 class="text-sm font-bold w-full text-left border-l border-gray-200 pl-2 pt-2">{promotion.title}</h4>
								<div class="text-xs uppercase text-gray-600 flex space-x-1 w-full text-left border-l border-gray-200 pl-2">
									<Date date={promotion.date} /> <span>-</span>
									<BaseOn data={promotion.baseOn} />
								</div>
								<div class="pt-2 text-xs border-l border-gray-200 pl-2">
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html promotion.description}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<h3 class="text-base font-bold w-full text-left pt-4">
						{job.title}
						{#if job.company}<span>at {job.company}</span>{/if}
					</h3>
					<div class="text-xs uppercase text-gray-600 flex space-x-1 w-full text-left">
						<Date date={job.date} /> <span>-</span>
						<BaseOn data={job.baseOn} />
					</div>
					<!-- TODO: avoid using @html -->
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="mt-2 text-xs">{@html job.description}</div>
				{/if}
			</li>
		{/each}
	</ul>

	<div class="w-full mt-6">
		<h2 class="text-2xl font-ropa-sans">Education</h2>
		<ul class="mt-2 space-y-4">
			<!-- TODO: resolve use key -->
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each cvData?.education as education}
				<li class="break-inside-avoid">
					<h3 class="text-base font-bold">{education.title}</h3>
					<div class="text-xs uppercase text-gray-600 flex space-x-1">
						<Date date={education.date} /> <span>-</span>
						<BaseOn data={education.baseOn} />
					</div>
					<div class="mt-2 text-xs">{education.description}</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

{#if !isPDFVersion}
	<div>
		<a
			href="/cover-letter"
			class={[
				!isLessThanCV || showButtons ? 'top-4' : '',
				isLessThanCV && !showButtons ? '-top-10' : '',
				'focus-ring fixed transition-all delay-150 duration-500 left-4 flex text-sm p-2 space-x-2 items-center bg-slate-100 hover:bg-slate-200 text-slate-600',
			].join(' ')}
		>
			check my cover letter
		</a>

		<button
			on:click={downloadPdf}
			disabled={isDownloading}
			aria-live="polite"
			aria-busy={isDownloading}
			class={[
				!isLessThanCV || showButtons ? 'top-4' : '',
				isLessThanCV && !showButtons ? '-top-10' : '',
				'focus-ring fixed transition-all delay-150 duration-500 right-4 flex text-sm p-2 space-x-2 items-center',
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
	</div>
{/if}
