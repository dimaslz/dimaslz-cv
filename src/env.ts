import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	API_DIMASLZ_URL: {
		private: true,
		static: false,
	}
});