import { expect, test } from '@playwright/test';

test('home page renders the CV with the expected name', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('h1')).toContainText('Dimas');
	await expect(page.locator('h1')).toContainText('López');
});

test('agent requests can negotiate markdown', async ({ page }) => {
	const response = await page.request.get('/', {
		headers: {
			Accept: 'text/markdown',
		},
	});

	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toContain('text/markdown');
	expect(response.headers()['x-markdown-tokens']).toBeTruthy();

	const markdown = await response.text();
	expect(markdown).toContain('Dimas');
	expect(markdown).toContain('López');
});

test('cover letter page links back to the resumé', async ({ page }) => {
	await page.goto('/cover-letter');

	await expect(page.locator('h1')).toContainText('Dimas');
	await expect(page.getByRole('link', { name: /check my resumé/i })).toBeVisible();
});
