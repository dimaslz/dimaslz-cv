/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return await fetch("https://api.dimaslz.dev")
		.then((data) => data.json());
}