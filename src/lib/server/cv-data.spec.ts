import { describe, expect, it } from 'vitest';
import { groupPromotions, htmlifyNewlines } from './cv-data';
import type { RawJob } from '@/types';

const baseJob = (overrides: Partial<RawJob> = {}): RawJob => ({
	title: 'Engineer',
	company: 'Acme',
	date: { from: { month: 'Jan', year: '2020' }, to: { month: 'current', year: 'current' } },
	baseOn: { country: 'Spain', city: 'Barcelona' },
	description: 'did stuff',
	keywords: [],
	...overrides,
});

describe('htmlifyNewlines', () => {
	it('replaces newlines with <br>', () => {
		expect(htmlifyNewlines('a\nb\nc')).toBe('a<br>b<br>c');
	});

	it('returns the string unchanged when there are no newlines', () => {
		expect(htmlifyNewlines('a b c')).toBe('a b c');
	});
});

describe('groupPromotions', () => {
	it('collapses a base role followed (newest-first) by a same-company promotion into a carrier entry', () => {
		const jobs: RawJob[] = [
			baseJob({ title: 'Lead Engineer', promotion: true }),
			baseJob({ title: 'Engineer' }),
		];

		const result = groupPromotions(jobs);

		expect(result).toHaveLength(1);
		const [entry] = result;
		expect('carrier' in entry && entry.carrier).toBe(true);
		if ('carrier' in entry) {
			expect(entry.company).toBe('Acme');
			expect(entry.promotions.map((p) => p.title)).toEqual(['Lead Engineer', 'Engineer']);
		}
	});

	it('leaves unrelated jobs from different companies ungrouped', () => {
		const jobs: RawJob[] = [baseJob({ company: 'Acme' }), baseJob({ company: 'Globex' })];

		const result = groupPromotions(jobs);

		expect(result).toHaveLength(2);
		expect(result.every((job) => !('carrier' in job))).toBe(true);
	});

	it('does not mutate the input array or its job objects', () => {
		const jobs: RawJob[] = [
			baseJob({ title: 'Lead Engineer', promotion: true }),
			baseJob({ title: 'Engineer' }),
		];
		const snapshot = structuredClone(jobs);

		groupPromotions(jobs);

		expect(jobs).toEqual(snapshot);
	});
});
