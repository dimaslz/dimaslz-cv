import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),
		alias: {
			'@/*': './src/*',
			'~/*': './*',
		},
	},

	onwarn: (warning, handler) => {
		const excludeSvelteKitFiles = warning.filename.includes('.svelte-kit');
		const excludeNodeModulesFiles = warning.filename.startsWith('node_modules/@lottiefiles');

		if (excludeSvelteKitFiles || excludeNodeModulesFiles) return;
		handler(warning);
	},
};

export default config;
