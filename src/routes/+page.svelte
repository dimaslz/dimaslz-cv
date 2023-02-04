<script lang="ts">
	import BaseOn from "./BaseOn.svelte";
	import Date from "./Date.svelte";
	export let data: any;
</script>

<svelte:head>
	<title>Dimas López resume - @dimaslz</title>
	<meta name="description" content="Dimas López resume - @dimaslz" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<section class="flex min-h-full flex-grow text-sm flex-col container max-w-[800px] items-center py-8">
	<div class="flex w-full">
		<div class="w-full">
			<h1 class="text-5xl flex flex-col w-full font-ropa-sans">
				<span>
					{data?.name} {data?.lastname}
				</span>
				<span class="text-sm uppercase text-slate-500 font-roboto font-light">{data?.title}</span>
			</h1>
		</div>
		<div class="w-full flex items-end justify-end font-light text-xs">
			{data.baseOn.city}, {data.baseOn.country} - {data.phone} - {data.email}
		</div>
	</div>

	<div class="mt-12">
		<h2 class="text-2xl">Profile</h2>
		<p class="text-sm mt-2">{data?.introduction}</p>
	</div>

	<div class="mt-8">
		<h2 class="text-2xl">Employment History</h2>
		{#if data?.jobs?.length}
			<ul class="mt-4 space-y-4">
				{#each data?.jobs as job}
					<li>
						<h3 class="text-lg font-bold">{job.title} - {job.company}</h3>
						<div class="text-xs uppercase text-gray-400 flex space-x-1">
							<Date date={job.date} /> <span>-</span> <BaseOn data={job.baseOn} />
						</div>
						<div class="mt-2 text-xs">{job.description}</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="mt-12 w-full">
		<h2 class="text-2xl">Education</h2>
		<ul class="mt-4 space-y-4">
			{#each data?.education as education}
				<li>
					<h3 class="text-lg font-bold">{education.title}</h3>
					<div class="text-xs uppercase text-slate-400 flex space-x-1">
						<Date date={education.date} /> <span>-</span> <BaseOn data={education.baseOn} />
					</div>
					<div class="mt-2 text-xs">{education.description}</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

