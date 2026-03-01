import { env } from "$env/dynamic/private";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const data = await fetch(env.API_DIMASLZ_URL)
		.then((data) => data.json())
		.catch(() => ({}));

	const jobs = data.jobs.reverse().reduce((acc: any[], curr: { promotion: any; company: any; }, index: number) => {
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

	data.introduction = data.introduction.replace(/\n/g, '<br>');
	data.jobs = data.jobs.map((job: any) => {
		job.description = job.description?.replace(/\n/g, '<br>');

		if (job.promotion) {
			job.promotion.description = job.promotion?.description?.replace(/\n/g, '<br>');
		}

		return job;
	});

	return {
		props: {
			data,
		}
	};
}