<script lang="ts">
	import { onMount } from "svelte";
	import { LottiePlayer } from "@/components";
	import { DownloadIcon } from "@/components/icons";
	import type { DimaslzData } from "@/types";

	export let data: {
		props: {
			data: DimaslzData,
		},
		layout: {
			isPdf: boolean;
			isDownload: boolean;
		}
	};

	const cvData = data.props.data || {};
	const isPDFVersion = !!data.layout.isPdf;
	let isDownloading = false;

	const downloadPdf = async () => {
		if (isDownloading) return;

		isDownloading = true;

		const pdf: Blob = await fetch('/api/generate-pdf', {
			method: 'POST',
			body: JSON.stringify({
				url: location.href,
			})
		})
			.then(data => data.blob())

		const pdfURL = URL.createObjectURL(pdf);

		const currentYear: number = (new window.Date()).getFullYear();
		const filename = `dimas-lopez-zurita-cover-letter-${currentYear}.pdf`
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
		return value.replace("\n\n", "\n").split("\n")
			.map(l => {
				if (l) {
					return `<div class="w-full text-xs">${l}</div>`
				}

				return `<div class="h-3"></div>`
			})
			.join("");
	}

	const container: Element[] = [];
	let firstPageSize = 0;

	const getElementsSize = (elements: Element[]) => {
		return elements
			.map(e => e.clientHeight)
			.reduce((a, b) => a + b, 0);
	};

	const loop = (allElements: Element[]) => {
		const size = getElementsSize(allElements);

		if (size > 1040) {
			const last = allElements.pop();
			if (last) {
				container.push(last);
			}

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
		const pageSize = section?.clientHeight || 0;
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
		if (pageSize > 1040) {
			spaceElement.style.minHeight = `${(restSize/10) + 4.8}rem`;
			spaceElement.style.height = `${restSize/10 + 4.8}rem`;
			newSection.append(spaceElement)
		}

		container.reverse().forEach(e => {
			newSection.append(e);
		})

		document.querySelector("main")?.append(newSection);
	});

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
				{cvData.baseOn.city}, {cvData.baseOn.country} - {cvData.phone} - {cvData.email}
			</div>
		</div>

		<div class="h-6"></div>
		<h2 class="text-2xl font-ropa-sans w-full">Cover Letter</h2>
		<div class="h-2"></div>
		<p class="text-xs">{@html renderDescriptionPDF(cvData?.coverLetter)}</p>
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
		<div class="flex flex-col sm:flex-row">
			<div class="text-sm uppercase text-slate-500 font-roboto font-light flex">{cvData?.title}</div>
			<div class="w-full flex items-end justify-end font-light text-xs flex-1 mt-4 sm:mt-0">
				{cvData.baseOn.city}, {cvData.baseOn.country} - {cvData.phone} - {cvData.email}
			</div>
		</div>
	</div>

	<div class="mt-6">
		<h2 class="text-2xl font-ropa-sans">Cover Letter</h2>
		<p class="text-xs mt-2">{@html renderDescription(cvData?.coverLetter)}</p>
	</div>
	{/if}
</section>

{#if !isPDFVersion}
	<a
		href="/"
		class="fixed top-4 left-4 flex text-sm p-2 space-x-2 items-center bg-slate-100 hover:bg-slate-200 text-slate-600 "
	>
		check my resumé
	</a>

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
