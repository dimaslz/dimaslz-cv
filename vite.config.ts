import path from "path";
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			"~": path.resolve(__dirname),
			"@": path.resolve(__dirname, "src"),
		},
	},
};

export default config;
