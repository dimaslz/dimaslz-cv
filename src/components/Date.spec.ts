import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DateRange from './Date.svelte';

describe('Date', () => {
	it('renders a month and year range', () => {
		render(DateRange, {
			date: {
				from: { month: 'Jan', year: '2020' },
				to: { month: 'Dec', year: '2022' },
			},
		});

		expect(screen.getByText(/Jan/)).toBeInTheDocument();
		expect(screen.getByText(/2020/)).toBeInTheDocument();
		expect(screen.getByText(/Dec/)).toBeInTheDocument();
		expect(screen.getByText(/2022/)).toBeInTheDocument();
	});

	it('never renders "current" or "-" as a literal month', () => {
		render(DateRange, {
			date: {
				from: { month: '-', year: '2011' },
				to: { month: 'current', year: 'current' },
			},
		});

		expect(screen.queryByText('current')).not.toBeInTheDocument();
		expect(screen.queryByText('-')).not.toBeInTheDocument();
		expect(screen.getByText(/2011/)).toBeInTheDocument();
	});
});
