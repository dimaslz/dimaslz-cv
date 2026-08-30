import { getCoverLetterViewData, getCvViewData } from '@/lib/server/cv-data';

function decodeHtml(value: string): string {
	return value
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'");
}

function stripHtml(value: string): string {
	return decodeHtml(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatDateRange(date?: { from: { month: string; year: string }; to: { month: string; year: string } }): string {
	if (!date) return '';

	const from = date.from.month && !['-', 'current'].includes(date.from.month) ? `${date.from.month} ` : '';
	const to = date.to.month && !['-', 'current'].includes(date.to.month) ? `${date.to.month} ` : '';

	return `${from}${date.from.year} - ${to}${date.to.year}`.trim();
}

function getTokenCount(markdown: string): number {
	return Array.from(markdown.matchAll(/\S+/g)).length;
}

function formatJob(job: Awaited<ReturnType<typeof getCvViewData>>['jobs'][number]): string[] {
	const lines: string[] = [];

	if ('carrier' in job) {
		lines.push(`### ${job.company}`);
		for (const promotion of job.promotions) {
			const dateText = formatDateRange(promotion.date);
			lines.push(`- ${promotion.title}${dateText ? ` (${dateText})` : ''}`);
			const description = stripHtml(promotion.description);
			if (description) {
				lines.push(description);
			}
		}
		return lines;
	}

	lines.push(`### ${job.title}${job.company ? ` at ${job.company}` : ''}`);
	const dateText = formatDateRange(job.date);
	if (dateText) {
		lines.push(`- ${dateText}`);
	}
	const description = stripHtml(job.description);
	if (description) {
		lines.push(description);
	}

	return lines;
}

export async function getCvMarkdown(): Promise<string> {
	const data = await getCvViewData();
	const lines = [
		`# ${data.name} ${data.lastname}`,
		`**${data.title}**`,
		'',
		`${data.baseOn.city}, ${data.baseOn.country} • ${data.phone} • ${data.email}`,
		'',
		'## Profile',
		stripHtml(data.introduction),
		'',
		'## Employment History',
	];

	for (const job of data.jobs) {
		lines.push(...formatJob(job));
		lines.push('');
	}

	lines.push('## Education');
	for (const education of data.education) {
		lines.push(`### ${education.title}`);
		const dateText = formatDateRange(education.date);
		if (dateText) {
			lines.push(`- ${dateText}`);
		}
		const description = stripHtml(education.description);
		if (description) {
			lines.push(description);
		}
		lines.push('');
	}

	return lines.filter((line) => line !== '').join('\n').trim();
}

export async function getCoverLetterMarkdown(): Promise<string> {
	const data = await getCoverLetterViewData();
	const lines = [
		`# ${data.name} ${data.lastname}`,
		`**${data.title}**`,
		'',
		...data.coverLetterParagraphs.map((paragraph) => stripHtml(paragraph)),
	];

	return lines.filter((line) => line !== '').join('\n\n').trim();
}

export function markdownResponse(markdown: string): Response {
	const tokenCount = getTokenCount(markdown);

	return new Response(markdown, {
		headers: {
			'content-type': 'text/markdown; charset=utf-8',
			'vary': 'Accept',
			'x-markdown-tokens': String(tokenCount),
		},
	});
}
