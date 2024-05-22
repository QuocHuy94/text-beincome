import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import { vi } from 'vitest';
import InputSearch from './index'; // Adjust path if necessary
import userEvent from '@testing-library/user-event';

describe('InputSearch component', () => {
	test('renders input with placeholder and search icon', () => {
		render(<InputSearch />);

		const input = screen.getByRole('textbox');
		expect(input).not.toBeNull();

		const searchIcon = screen.getByAltText('search');
		expect(searchIcon).not.toBeNull();
	});

	test('fires onChange callback on input change', async () => {
		const mockOnChange = vi.fn();
		const { container, getByText } = render(
			<InputSearch onChange={mockOnChange} />
		);

		const input = screen.getByPlaceholderText('search');

		await waitFor(async () => {
			fireEvent.change(input, { target: { value: 'test value' } });
		});

		expect(screen.getByDisplayValue('test value')).not.toBeNull();
	});

	test('fires onKeyDown callback on Enter key press', () => {
		const mockOnKeyDown = vi.fn();
		render(<InputSearch onKeyDown={mockOnKeyDown} />);

		const input = screen.getByRole('textbox');
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
	});

	test('fires onKeyDown callback with current value on other key presses', async () => {
		const mockOnKeyDown = vi.fn();
		render(<InputSearch onKeyDown={mockOnKeyDown} />);

		const input = screen.getByRole('textbox');
		await act(async () => {
			fireEvent.change(input, { target: { value: 'test value' } });
		});
		fireEvent.keyDown(input, { target: { key: 'a', code: 'KeyA' } });

		expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
	});
});
