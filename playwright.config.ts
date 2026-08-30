import type { PlaywrightTestConfig } from '@playwright/test';

const apiDimaslzUrl = process.env.API_DIMASLZ_URL ?? 'https://api.dimaslz.dev';

const config: PlaywrightTestConfig = {
	webServer: {
		command: `API_DIMASLZ_URL=${apiDimaslzUrl} npm run build && API_DIMASLZ_URL=${apiDimaslzUrl} npm run preview -- --port 4173`,
		env: {
			...process.env,
			API_DIMASLZ_URL: apiDimaslzUrl,
		},
		port: 4173,
	},
	testDir: 'tests',
};

export default config;
