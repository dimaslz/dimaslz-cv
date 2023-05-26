/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {

	const isPdf = url.searchParams.has("pdf");

	return {
		layout: {
			isPdf
		}
	};
}