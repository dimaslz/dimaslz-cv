<script lang="ts">
	import { onMount } from 'svelte';
	import { BaseOn, Date, LottiePlayer } from '@/components';
	import { DownloadIcon } from '@/components/icons';
	import { CV_WIDTH } from '@/constants';
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
	const isDownload = !!data.layout.isDownload;
	let isDownloading = false;

	const downloadPdf = async () => {
		if (isDownloading) return;

		isDownloading = true;

		await downloadPDF('dimas-lopez-zurita-resume');

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

		if (!isPDFVersion) {
			isLessThanCV = widthIsLessThanCV();

			document.addEventListener('scroll', onScrollHandler);
			window.addEventListener('resize', onResizeHandler);

			return () => {
				document.removeEventListener('scroll', onScrollHandler);
				window.removeEventListener('resize', onResizeHandler);
			};
		}

		const elements = [...document.querySelectorAll('section > *')];
		loopHTMLElements(elements);

		const section = document.querySelector('section');
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
		spaceElement.style.minHeight = `${restSize / 10 + 1}rem`;
		spaceElement.style.height = `${restSize / 10 + 1}rem`;
		newSection.append(spaceElement);

		container.reverse().forEach((e) => {
			newSection.append(e);
		});

		document.querySelector('main')?.append(newSection);
	});
</script>

<section
	id="CV"
	class="flex min-h-full grow text-sm flex-col container max-w-[800px] items-center p-8 text-left w-full"
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

	<!-- version PDF -->
	{#if isPDFVersion}
		<h1 class="text-4xl flex flex-col w-full font-ropa-sans md:mb-0">
			<span>
				{cvData?.name}
				{cvData?.lastname}
			</span>
		</h1>
		<div class="flex flex-row w-full">
			<div class="text-sm uppercase text-gray-500 font-roboto font-light flex">{cvData?.title}</div>
			<div class="w-full flex items-end justify-end font-light text-xs flex-1">
				{cvData?.baseOn?.city}, {cvData?.baseOn?.country} - {cvData?.phone} - {cvData?.email}
			</div>
		</div>

		<div class="h-6"></div>
		<h2 class="text-2xl font-ropa-sans w-full">Profile</h2>
		<div class="h-2"></div>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p class="text-xs">{@html cvData?.introduction}</p>

		<div class="h-6"></div>
		<h2 class="text-2xl font-ropa-sans w-full">Employment History</h2>

		{#if cvData?.jobs?.length}
			<!-- TODO: resolve use key -->
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each cvData?.jobs as job}
				<div class="h-4"></div>
				{#if job.carrier}
					<h3 class="text-base font-bold text-left w-full">{job.company}</h3>
					<!-- TODO: resolve use key -->
					<!-- eslint-disable-next-line svelte/require-each-key -->
					{#each job.promotions as promotion}
						<h4 class="text-sm font-bold text-left w-full border-l border-gray-200 pl-2">
							{promotion.title}
						</h4>
						<div
							class="text-xs uppercase text-gray-500 flex space-x-1 text-left w-full border-l border-gray-200 pl-2"
						>
							<Date date={promotion.date} /> <span>-</span>
							<BaseOn data={promotion.baseOn} />
						</div>
						<div class="pt-2 text-xs border-l border-gray-200 pl-2">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html promotion.description}
						</div>
					{/each}
				{:else}
					<h3 class="text-base font-bold text-left w-full">
						{job.title}
						{#if job.company}<span>at {job.company}</span>{/if}
					</h3>
					<div class="text-xs uppercase text-gray-500 flex space-x-1 text-left w-full">
						<Date date={job.date} /> <span>-</span>
						<BaseOn data={job.baseOn} />
					</div>
					<div class="mt-2 text-xs">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html job.description}
					</div>
				{/if}
			{/each}
		{/if}

		<div class="h-6"></div>
		<h2 class="text-2xl font-ropa-sans w-full">Education</h2>
		<!-- TODO: resolve use key -->
		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each cvData?.education as education}
			<h3 class="text-base font-bold w-full">{education.title}</h3>
			<div class="text-xs uppercase text-gray-500 flex space-x-1 w-full">
				<Date date={education.date} /> <span>-</span>
				<BaseOn data={education.baseOn} />
			</div>
			<div class="h-2"></div>
			<div class="text-xs w-full">{education.description}</div>
		{/each}
	{/if}

	<!-- NORMAL -->
	{#if !isPDFVersion}
		<div class="flex w-full flex-col">
			<div class="w-full">
				<h1 class="text-4xl flex flex-col w-full font-ropa-sans md:mb-0">
					<span>
						{cvData?.name}
						{cvData?.lastname}
					</span>
				</h1>
			</div>
			<div class="flex flex-col sm:flex-row">
				<div class="text-sm uppercase text-gray-500 font-roboto font-light flex">
					{cvData?.title}
				</div>
				<div
					class="w-full flex items-end justify-end font-light text-xs flex-1 mt-4 sm:mt-0 leading-5"
				>
					{cvData?.baseOn?.city}, {cvData?.baseOn?.country} - {cvData?.phone} - {cvData?.email}
				</div>
			</div>
		</div>

		<div class="mt-6">
			<h2 class="text-2xl font-ropa-sans">Profile</h2>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p class="text-xs mt-2">{@html cvData?.introduction}</p>
		</div>

		<div class="mt-6">
			<h2 class="text-2xl font-ropa-sans">Employment History</h2>
			{#if cvData?.jobs?.length}
				<ul class="mt-2 space-y-4">
					<!-- TODO: resolve use key -->
					<!-- eslint-disable-next-line svelte/require-each-key -->
					{#each cvData?.jobs as job}
						{#if job.carrier}
							<li>
								<h3 class="text-base font-bold">{job.company}</h3>
								<ul class="border-l border-gray-200 pl-2 space-y-4">
									<!-- TODO: resolve use key -->
									<!-- eslint-disable-next-line svelte/require-each-key -->
									{#each job.promotions as promotion}
										<li>
											<h4 class="text-sm font-bold">{promotion.title}</h4>
											<div class="text-xs uppercase text-gray-500 flex space-x-1">
												<Date date={promotion.date} /> <span>-</span>
												<BaseOn data={promotion.baseOn} />
											</div>
											<div class="mt-2 text-xs">
												<!-- eslint-disable-next-line svelte/no-at-html-tags -->
												{@html promotion.description}
											</div>
										</li>
									{/each}
								</ul>
							</li>
						{:else}
							<li>
								<h3 class="text-base font-bold">
									{job.title}
									{#if job.company}<span>at {job.company}</span>{/if}
								</h3>
								<div class="text-xs uppercase text-gray-500 flex space-x-1">
									<Date date={job.date} /> <span>-</span>
									<BaseOn data={job.baseOn} />
								</div>
								<!-- TODO: avoid using @html -->
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<div class="mt-2 text-xs">{@html job.description}</div>
							</li>
						{/if}
					{/each}
				</ul>
			{/if}
		</div>

		<div class="w-full mt-6">
			<h2 class="text-2xl font-ropa-sans">Education</h2>
			<ul class="mt-2 space-y-4">
				<!-- TODO: resolve use key -->
				<!-- eslint-disable-next-line svelte/require-each-key -->
				{#each cvData?.education as education}
					<li>
						<h3 class="text-base font-bold">{education.title}</h3>
						<div class="text-xs uppercase text-gray-500 flex space-x-1">
							<Date date={education.date} /> <span>-</span>
							<BaseOn data={education.baseOn} />
						</div>
						<div class="mt-2 text-xs">{education.description}</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>

{#if !isPDFVersion}
	<div>
		<a
			href="/cover-letter"
			class={[
				!isLessThanCV || showButtons ? 'top-4' : '',
				isLessThanCV && !showButtons ? '-top-10' : '',
				'fixed transition-all delay-150 duration-500 left-4 flex text-sm p-2 space-x-2 items-center bg-slate-100 hover:bg-slate-200 text-slate-600',
			].join(' ')}
		>
			check my cover letter
		</a>

		<button
			on:click={downloadPdf}
			disabled={isDownloading}
			class={[
				!isLessThanCV || showButtons ? 'top-4' : '',
				isLessThanCV && !showButtons ? '-top-10' : '',
				'fixed transition-all delay-150 duration-500 right-4 flex text-sm p-2 space-x-2 items-center',
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
	</div>
{/if}
