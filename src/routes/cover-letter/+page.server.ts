import { env } from "$env/dynamic/private";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const data = await fetch(env.API_DIMASLZ_URL)
		.then((data) => data.json())
		.catch(() => ({}));

	data.coverLetter = data.coverLetter.replace(/\n/g, '<br>');

	return {
		props: {
			data,
		}
	};
}