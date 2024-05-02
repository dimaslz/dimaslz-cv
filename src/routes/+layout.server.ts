/** @type {import('./$types').PageServerLoad} */
export async function load({ url }: { url: URL }) {

	const isPdf = url.searchParams.has("pdf");
	const isDownload = url.searchParams.has("download");

	return {
		layout: {
			isPdf,
			isDownload
		}
	};
}