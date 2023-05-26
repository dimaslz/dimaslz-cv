import { API_DIMASLZ_URL } from "$env/static/private";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const data = await fetch(API_DIMASLZ_URL)
		.then((data) => data.json())
		.catch(() => ({}));

	return {
		props: {
			data,
		}
	};
}