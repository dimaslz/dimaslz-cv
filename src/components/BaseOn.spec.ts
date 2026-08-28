import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import BaseOn from './BaseOn.svelte';

describe('BaseOn', () => {
	it('renders city, country and mode when provided', () => {
		render(BaseOn, { data: { city: 'Barcelona', country: 'Spain', mode: 'hybrid' } });

		expect(screen.getByText(/Barcelona, Spain/)).toBeInTheDocument();
		expect(screen.getByText(/\(hybrid\)/)).toBeInTheDocument();
	});

	it('omits the parenthetical mode when not provided', () => {
		render(BaseOn, { data: { city: 'Barcelona', country: 'Spain' } });

		expect(screen.getByText(/Barcelona, Spain/)).toBeInTheDocument();
		expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
	});
});
