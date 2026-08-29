import { API_DIMASLZ_URL } from '$app/env/private';
import type { CareerJob, DimaslzCoverLetterData, DimaslzRawData, DimaslzViewData, RawJob } from '@/types';

export async function getRawCvData(): Promise<DimaslzRawData> {
	const data = await fetch(API_DIMASLZ_URL).then((data) => data.json());

	return structuredClone(data);
}

export function htmlifyNewlines(
	text: string,
	options?: { isPromotion?: boolean; isPdfVersion?: boolean }): string {

	const { isPromotion = false, isPdfVersion = false } = options || {};

	return text
		.replace(/\n\n/g, '<br>')
		.replace(/\n/g, '<br>')
		.split("<br>")
		.filter(Boolean)
		.map((l) => {
			if (isPromotion && !isPdfVersion) {
				// return `<div class="w-full text-left">${l}</div>`
				return `<span class="w-full text-left">${l}</span>`
				// return l;
			} else if (!isPdfVersion && !isPromotion) {
				return `<span class="w-full text-left">${l}</span>`
			} else if (isPdfVersion && isPromotion) {
				return `<span class="w-full text-left pl-2 pt-2 border-l border-gray-200">${l}</span>`
			} else if (isPdfVersion) {
				return `<span class="w-full text-left pl-2 pt-2">${l}</span>`
			}

			return `<span class="w-full text-left">ddd${l}</span>`
		}).join(isPdfVersion ? "" : "<br>");
}

export function groupPromotions(jobs: Array<RawJob>): Array<RawJob | CareerJob> {
	const chronological = [...jobs].reverse();

	const grouped = chronological.reduce<Array<RawJob | CareerJob>>((acc, curr) => {
		const previous = acc[acc.length - 1];

		if (curr.promotion && previous && previous.company === curr.company) {
			const promotions =
				'carrier' in previous ? [curr, ...previous.promotions] : [curr, previous as RawJob];

			acc[acc.length - 1] = {
				carrier: true,
				company: curr.company as string,
				promotions,
			};

			return acc;
		}

		acc.push(curr);

		return acc;
	}, []);

	return grouped.reverse();
}

export async function getCvViewData(isPdfVersion: boolean = false): Promise<DimaslzViewData> {
	const data = await getRawCvData();

	return {
		...data,
		introduction: htmlifyNewlines(data.introduction, { isPromotion: false, isPdfVersion }),
		jobs: groupPromotions(data.jobs).map((job) => {
			if ('carrier' in job) {
				return {
					...job,
					promotions: job.promotions.map((promotion) => ({
						...promotion,
						description: htmlifyNewlines(promotion.description, {
							isPromotion: true,
							isPdfVersion
						}),
					})),
				};
			}

			return {
				...job,
				description: htmlifyNewlines(job.description, { isPromotion: false, isPdfVersion })
			};
		}),
		education: data.education.map((education) => {
			return {
				...education,
				description: htmlifyNewlines(education.description, { isPromotion: false, isPdfVersion })
			}
		})
	};
}

export async function getCoverLetterViewData(): Promise<DimaslzCoverLetterData> {
	const data = await getRawCvData();

	const coverLetterParagraphs = data.coverLetter
		.split('\n')
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	return { ...data, coverLetterParagraphs };
}
