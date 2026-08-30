import { getCoverLetterMarkdown, markdownResponse } from '@/lib/server/markdown';

export const GET = async ({ request }) => {
	const accept = request.headers.get('accept') ?? '';

	if (!accept.includes('text/markdown')) {
		return new Response(null, { status: 406, headers: { 'content-type': 'text/plain; charset=utf-8' } });
	}

	const markdown = await getCoverLetterMarkdown();
	return markdownResponse(markdown);
};
