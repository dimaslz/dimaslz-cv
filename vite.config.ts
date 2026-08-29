import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, 'src'),
			'~': path.resolve(import.meta.dirname),
		},
		// force the browser build of Svelte components under Vitest, otherwise
		// vite-plugin-svelte resolves them to the SSR build and `mount()` fails
		conditions: process.env.VITEST ? ['browser'] : [],
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['src/setup-test.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
