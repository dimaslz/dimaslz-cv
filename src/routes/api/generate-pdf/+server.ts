import type { RequestHandler } from './$types';
import { printPDF } from '@/utils';

const DEFAULT_FILENAME = 'dimas-lopez-zurita-resume';

function sanitizeFilename(filename: unknown): string {
	if (typeof filename !== 'string') return DEFAULT_FILENAME;

	const sanitized = filename.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 100);

	return sanitized || DEFAULT_FILENAME;
}

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const { url, filename } = await request.json();

	const target = new URL(url);
	target.search = '';
	target.searchParams.set('pdf', '');

	const pdfFile = (await printPDF({ url: target.toString() })) as Blob;

	const currentYear: number = new Date().getFullYear();
	const safeFilename = sanitizeFilename(filename);

	return new Response(pdfFile, {
		status: 200,
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename=${safeFilename}-${currentYear}.pdf`,
		},
	});
};
