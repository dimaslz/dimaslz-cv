import path from "path";
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'


const config: UserConfig = {
	plugins: [sveltekit(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"~": path.resolve(__dirname),
		},
	},
};

export default config;
