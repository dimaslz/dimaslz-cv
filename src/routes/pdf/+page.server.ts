import { getCvViewData } from '@/lib/server/cv-data';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		props: {
			data: await getCvViewData(true),
		},
	};
}
