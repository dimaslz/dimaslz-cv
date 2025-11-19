import { env } from "$env/dynamic/private";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const data = await fetch(env.API_DIMASLZ_URL)
		.then((data) => data.json())
		.catch(() => ({}));

	const jobs = data.jobs.reverse().reduce((acc, curr, index) => {
		if (curr.promotion) {
			acc[index - 1] = {
				carrier: true,
				company: curr.company,
				promotions: [
					curr,
					acc[index - 1],
				]
			};
		} else {
			acc.push(curr);
		}

		return acc;
	}, []).reverse();

	data.jobs = jobs;

	return {
		props: {
			data,
		}
	};
}