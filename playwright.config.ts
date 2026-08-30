import type { PlaywrightTestConfig } from '@playwright/test';

const apiDimaslzUrl = process.env.API_DIMASLZ_URL;

const config: PlaywrightTestConfig = {
	webServer: {
		command: `npm run build && npm run preview -- --port 4173`,
		env: {
			...process.env,
			API_DIMASLZ_URL: apiDimaslzUrl,
		},
		port: 4173,
	},
	testDir: 'tests',
};

export default config;
