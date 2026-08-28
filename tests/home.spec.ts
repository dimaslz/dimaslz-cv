import { expect, test } from '@playwright/test';

test('home page renders the CV with the expected name', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('h1')).toContainText('Dimas');
	await expect(page.locator('h1')).toContainText('López');
});

test('cover letter page links back to the resumé', async ({ page }) => {
	await page.goto('/cover-letter');

	await expect(page.locator('h1')).toContainText('Dimas');
	await expect(page.getByRole('link', { name: /check my resumé/i })).toBeVisible();
});
