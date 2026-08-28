declare module '@lottiefiles/svelte-lottie-player';

export type BaseOn = {
	country: string;
	city: string;
	mode?: string | null;
};

export type DateParts = {
	month: string;
	year: string;
};

export type RawJob = {
	title: string;
	company: string | null;
	promotion?: true;
	date: {
		from: DateParts;
		to: DateParts;
	};
	baseOn: BaseOn;
	description: string;
	keywords: Array<string>;
};

export type CareerJob = {
	carrier: true;
	company: string;
	promotions: Array<RawJob>;
};

export type ViewJob = RawJob | CareerJob;

export type RawProject = {
	name: string;
	description: string;
	skills: Array<string>;
	keywords: Array<string>;
	public: boolean;
	npm: string | null;
	url: string;
	repository: Array<string>;
};

export type Education = {
	date: {
		from: DateParts;
		to: DateParts;
	};
	baseOn: BaseOn;
	title: string;
	description: string;
};

export type DimaslzRawData = {
	name: string;
	lastname: string;
	title: string;
	email: string;
	baseOn: BaseOn;
	alias: string;
	phone: string;
	introduction: string;
	coverLetter: string;
	keywords: Array<string>;
	jobs: Array<RawJob>;
	network: {
		linkedin: string;
		github: string;
		twitter: string;
	};
	formerJobs: Array<string>;
	education: Array<Education>;
	status: Array<string>;
	interests: string;
	projects: Array<RawProject>;
};

export type DimaslzViewData = Omit<DimaslzRawData, 'jobs'> & {
	jobs: Array<ViewJob>;
};

export type DimaslzCoverLetterData = DimaslzRawData & {
	coverLetterParagraphs: Array<string>;
};

export type BaseOn = {
	country: string;
	city: string;
	mode?: string;
};

export type Date = {
	month: string;
	year: string;
};
