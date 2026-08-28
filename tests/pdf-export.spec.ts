import { expect, test } from '@playwright/test';
import { PDFParse } from 'pdf-parse';

test.describe('PDF export', () => {
	test('generates a multi-page PDF for the resumé with the expected content', async ({
		request,
		baseURL,
	}) => {
		const response = await request.post('/api/generate-pdf', {
			data: { url: `${baseURL}/`, filename: 'dimas-lopez-zurita-resume' },
		});

		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toBe('application/pdf');
		expect(response.headers()['content-disposition']).toContain('dimas-lopez-zurita-resume-');

		const buffer = await response.body();
		const parser = new PDFParse({ data: buffer });
		const info = await parser.getInfo();
		const { text } = await parser.getText();
		await parser.destroy();

		expect(info.total).toBeGreaterThan(1);
		expect(text).toContain('López');
		expect(text).toContain('Lead Software Engineer');
	});

	test('generates a PDF for the cover letter', async ({ request, baseURL }) => {
		const response = await request.post('/api/generate-pdf', {
			data: { url: `${baseURL}/cover-letter`, filename: 'dimas-lopez-zurita-cover-letter' },
		});

		expect(response.status()).toBe(200);
		expect(response.headers()['content-disposition']).toContain(
			'dimas-lopez-zurita-cover-letter-',
		);

		const buffer = await response.body();
		const parser = new PDFParse({ data: buffer });
		const { text } = await parser.getText();
		await parser.destroy();

		expect(text).toContain('Cover Letter');
	});

	test('still generates a valid PDF when the source url already has a query string', async ({
		request,
		baseURL,
	}) => {
		// regression test: the endpoint used to naively do `${url}?pdf`, which broke on
		// urls that already had a query string (e.g. `/?download`)
		const response = await request.post('/api/generate-pdf', {
			data: { url: `${baseURL}/?download`, filename: 'dimas-lopez-zurita-resume' },
		});

		expect(response.status()).toBe(200);

		const buffer = await response.body();
		const parser = new PDFParse({ data: buffer });
		const info = await parser.getInfo();
		await parser.destroy();

		expect(info.total).toBeGreaterThan(0);
	});

	test('sanitizes the requested filename before it lands in the Content-Disposition header', async ({
		request,
		baseURL,
	}) => {
		const response = await request.post('/api/generate-pdf', {
			data: { url: `${baseURL}/`, filename: '../../etc/passwd; evil"header' },
		});

		expect(response.status()).toBe(200);

		const disposition = response.headers()['content-disposition'];
		expect(disposition).not.toContain('..');
		expect(disposition).not.toContain('"');
		expect(disposition).not.toContain('/');
	});

	test('clicking "download pdf version" on the resumé actually starts a download', async ({
		page,
	}) => {
		// exercises real client-side hydration and the button's click handler end-to-end;
		// the API-only tests above would not catch a hydration failure that leaves the
		// button inert (e.g. a Svelte/SvelteKit version mismatch breaking hydration).
		await page.goto('/');

		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /download pdf version/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/^dimas-lopez-zurita-resume-\d{4}\.pdf$/);
	});

	test('clicking "download pdf version" on the cover letter actually starts a download', async ({
		page,
	}) => {
		await page.goto('/cover-letter');

		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /download pdf version/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/^dimas-lopez-zurita-cover-letter-\d{4}\.pdf$/);
	});
});
