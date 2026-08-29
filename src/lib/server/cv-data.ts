import { API_DIMASLZ_URL } from '$app/env/private';
import type { CareerJob, DimaslzCoverLetterData, DimaslzRawData, DimaslzViewData, RawJob } from '@/types';

export async function getRawCvData(): Promise<DimaslzRawData> {
	const data = await fetch(API_DIMASLZ_URL).then((data) => data.json());

	return structuredClone(data);
}

export function htmlifyNewlines(text: string): string {
	return text.replace(/\n/g, '<br>');
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

export async function getCvViewData(): Promise<DimaslzViewData> {
	const data = await getRawCvData();

	return {
		...data,
		introduction: htmlifyNewlines(data.introduction),
		jobs: groupPromotions(data.jobs).map((job) => {
			if ('carrier' in job) {
				return {
					...job,
					promotions: job.promotions.map((promotion) => ({
						...promotion,
						description: htmlifyNewlines(promotion.description),
					})),
				};
			}

			return { ...job, description: htmlifyNewlines(job.description) };
		}),
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
