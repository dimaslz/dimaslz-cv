<script lang="ts">
	import { onMount } from "svelte";
	import { BaseOn, Date, LottiePlayer } from "@/components";
	import { DownloadIcon } from "@/components/icons";

	export let data: any;

	const cvData = data.props.data || {};
	const isPDFVersion = !!data.layout.isPdf;
	let isDownloading = false;

	const downloadPdf = async () => {
		if (isDownloading) return;

		isDownloading = true;

		const pdf: any = await fetch('/api/generate-pdf', {
			method: 'POST',
			body: JSON.stringify({
				url: location.origin,
			})
		})
			.then(data => data.blob())

		const pdfURL = URL.createObjectURL(pdf);

		const currentYear: number = (new window.Date()).getFullYear();
		const filename = `dimas-lopez-zurita-resume-${currentYear}.pdf`
    const link = document.createElement('a');
    link.href = pdfURL;
    link.download = filename;
    link.dispatchEvent(new MouseEvent('click'));

    URL.revokeObjectURL(pdfURL);

		isDownloading = false;
	}

	const renderDescription = (value: string) => {
		return value.replaceAll("\n", "</br>");
	}

	const renderDescriptionPDF = (value: string) => {
		return value.split("\n")
			.map(l => {
				if (l) {
					return `<div class="w-full text-xs">${l}</div>`
				}

				return `<div class="h-3"></div>`
			})
			.join("");
	}

	const container: any[] = [];
	let firstPageSize = 0;

	const getElementsSize = (elements: any[]) => {
		return elements
			.map(e => e.clientHeight)
			.reduce((a, b) => a + b, 0);
	};

	const loop = (allElements: any) => {
		const size = getElementsSize(allElements);

		if (size > 1040) {
			const last = allElements.pop();
			container.push(last);

			loop(allElements);
		} else {
			firstPageSize = Number(size);
		}
	}

	onMount(async () => {
		if (!isPDFVersion) return;

		const elements = [...document.querySelectorAll("section > *")];
		loop(elements);

		const section = document.querySelector("section");
		const classes = section?.className;
		if (section) {
			document.querySelector("main")?.removeChild(section);
		}
		const newSection = document.createElement("section");
		newSection.id="CV";
		if (classes) {
			newSection.className = classes;
		}

		const restSize = 1040 - firstPageSize

		elements.forEach(e => {
			newSection.append(e);
		});

		const spaceElement = document.createElement('div');
		spaceElement.style.minHeight = `${(restSize/10) + 4.8}rem`;
		spaceElement.style.height = `${restSize/10 + 4.8}rem`;
		newSection.append(spaceElement)

		container.reverse().forEach(e => {
			newSection.append(e);
		})

		document.querySelector("main")?.append(newSection);
	})

</script>

<section id="CV" class="flex min-h-full flex-grow text-sm flex-col container max-w-[800px] items-center py-8 px-8 space-y-6-">
	<!-- version PDF -->
	{#if isPDFVersion}
		<h1 class="text-4xl flex flex-col w-full font-ropa-sans md:mb-0">
			<span>
				{cvData?.name} {cvData?.lastname}
			</span>
		</h1>
		<div class="flex flex-row w-full">
			<div class="text-sm uppercase text-slate-500 font-roboto font-light flex">{cvData?.title}</div>
			<div class="w-full flex items-end justify-end font-light text-xs flex-1">
				{cvData?.baseOn?.city}, {cvData?.baseOn?.country} - {cvData?.phone} - {cvData?.email}
			</div>
		</div>

		<div class="h-6"></div>
		<h2 class="text-2xl font-ropa-sans w-full">Profile</h2>
		<div class="h-2"></div>
		<p class="text-xs">{@html renderDescriptionPDF(cvData?.introduction)}</p>

		<div class="h-6"></div>
		<h2 class="text-2xl font-ropa-sans w-full">Employment History</h2>
		{#if cvData?.jobs?.length}
			{#each cvData?.jobs as job}
				<div class="h-4"></div>
				<h3 class="text-base font-bold w-full">
					{job.title} {#if job.company}<span>at {job.company}</span>{/if}
				</h3>
				<div class="text-xs uppercase text-gray-400 flex space-x-1 w-full">
					<Date date={job.date} /> <span>-</span> <BaseOn data={job.baseOn} />
				</div>
				<div class="h-2"></div>
				{@html renderDescriptionPDF(job.description)}
			{/each}
		{/if}

		<div class="h-6"></div>
		<h2 class="text-2xl font-ropa-sans w-full">Education</h2>
		{#each cvData?.education as education}
			<h3 class="text-base font-bold w-full">{education.title}</h3>
			<div class="text-xs uppercase text-slate-400 flex space-x-1 w-full">
				<Date date={education.date} /> <span>-</span> <BaseOn data={education.baseOn} />
			</div>
			<div class="h-2"></div>
			<div class="text-xs w-full">{education.description}</div>
		{/each}
	{/if}

	{#if !isPDFVersion}
	<!-- NORMAL -->
	<div class="flex w-full flex-col md:flex-row-">
		<div class="w-full">
			<h1 class="text-4xl flex flex-col w-full font-ropa-sans md:mb-0">
				<span>
					{cvData?.name} {cvData?.lastname}
				</span>
			</h1>
		</div>
		<div class="flex flex-row">
			<div class="text-sm uppercase text-slate-500 font-roboto font-light flex">{cvData?.title}</div>
			<div class="w-full flex items-end justify-end font-light text-xs flex-1">
				{cvData?.baseOn?.city}, {cvData?.baseOn?.country} - {cvData?.phone} - {cvData?.email}
			</div>
		</div>
	</div>

	<div class="mt-6">
		<h2 class="text-2xl font-ropa-sans">Profile</h2>
		<p class="text-xs mt-2">{@html renderDescription(cvData?.introduction)}</p>
	</div>

	<div class="mt-6">
		<h2 class="text-2xl font-ropa-sans">Employment History</h2>
		{#if cvData?.jobs?.length}
			<ul class="mt-2 space-y-4">
				{#each cvData?.jobs as job}
					<li>
						<h3 class="text-base font-bold">
							{job.title} {#if job.company}<span>at {job.company}</span>{/if}
						</h3>
						<div class="text-xs uppercase text-gray-400 flex space-x-1">
							<Date date={job.date} /> <span>-</span> <BaseOn data={job.baseOn} />
						</div>
						<div class="mt-2 text-xs">{@html renderDescription(job.description)}</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="w-full mt-6">
		<h2 class="text-2xl font-ropa-sans">Education</h2>
		<ul class="mt-2 space-y-4">
			{#each cvData?.education as education}
				<li>
					<h3 class="text-base font-bold">{education.title}</h3>
					<div class="text-xs uppercase text-slate-400 flex space-x-1">
						<Date date={education.date} /> <span>-</span> <BaseOn data={education.baseOn} />
					</div>
					<div class="mt-2 text-xs">{education.description}</div>
				</li>
			{/each}
		</ul>
	</div>
	{/if}
</section>

{#if !isPDFVersion}
	<button
		on:click={downloadPdf}
		disabled={isDownloading}
		class={[
			"fixed top-4 right-4 flex text-sm p-2 space-x-2 items-center",
			isDownloading
				? "bg-slate-50 text-slate-400 cursor-not-allowed"
				: "download-pdf-animation bg-slate-100 hover:bg-slate-200 text-slate-600",
		].join(" ")}
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

{#if !isPDFVersion}
<div class="fixed p-4 bottom-0 right-0 flex">
	<a href="https://github.com/dimaslz" class="p-2 text-sm hover:opacity-60 hover:bg-slate-100">gh</a>
	<a href="https://www.linkedin.com/in/dimaslopezzurita" class="p-2 text-sm hover:opacity-60 hover:bg-slate-100">in</a>
	<a href="https://twitter.com/dimaslz" class="p-2 text-sm hover:opacity-60 hover:bg-slate-100">tw</a>
</div>
{/if}
