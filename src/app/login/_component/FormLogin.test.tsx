import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import FormLogin from './FormLogin'; // Adjust path if necessary
import { expect, vi, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ push: vi.fn() }),
}));

const mockFetch = vi.fn().mockResolvedValue(
	new Response(JSON.stringify({ accessToken: 'mocked-token' }), {
		status: 200,
	})
);

global.fetch = mockFetch as any; // Mock fetch for API call

describe('FormLogin component', () => {
	beforeEach(() => {
		vi.clearAllMocks(); // Reset mocks before each test
	});

	test('renders login form with labels and inputs', async () => {
		await render(<FormLogin />);

		expect(screen.getAllByText('Email')).not.toBeNull();
		expect(screen.getAllByText('Password')).not.toBeNull();
	});

	test('validates email on submit and shows error message', async () => {
		await render(<FormLogin />);

		await act(async () => {
			fireEvent.submit(screen.getByText('Log in'));
		});

		expect(screen.getByText('email is a required field')).not.toBeNull();
	});

	test('validates password on submit and shows error message', async () => {
		await render(<FormLogin />);

		const emailInput = screen.getByRole('textbox');
		fireEvent.change(emailInput, {
			target: { value: 'test@example.com' },
		});

		await act(async () => {
			fireEvent.submit(screen.getByText('Log in'));
		});

		expect(screen.getByText('password is a required field')).not.toBeNull();
	});

	test('submits form with valid credentials and redirects', async () => {
		const { container } = await render(<FormLogin />);

		const emailInput = screen.getByRole('textbox');
		fireEvent.change(emailInput, {
			target: { value: 'test@example.com' },
		});

		const passwordInput = container.querySelector('#password');

		if (passwordInput) {
			fireEvent.change(passwordInput, {
				target: { value: 'securepassword' },
			});
		}

		await act(async () => {
			fireEvent.submit(screen.getByText('Log in'));
		});

		expect(mockFetch).toHaveBeenCalledTimes(1); // Check API call
		expect(mockFetch).toHaveBeenCalledWith('/api/login', {
			method: 'POST',
			headers: { contentType: 'application/json' },
			body: JSON.stringify({
				email: 'test@example.com',
				password: 'securepassword',
			}),
		});
	});

	test('shows error message on failed login attempt (email not found)', async () => {
		mockFetch.mockResolvedValueOnce(
			new Response(
				JSON.stringify({ errorKey: 'error.email.not.found' }),
				{
					status: 401,
				}
			)
		);

		const { container } = await render(<FormLogin />);

		const emailInput = screen.getByRole('textbox');

		fireEvent.change(emailInput, {
			target: { value: 'invalid@example.com' },
		});

		const passwordInput = container.querySelector('#password');

		if (passwordInput) {
			fireEvent.change(passwordInput, {
				target: { value: 'securepassword' },
			});
		}

		await act(async () => {
			fireEvent.submit(screen.getByText('Log in'));
		});

		expect(screen.getByText('This email does not exist')).not.toBeNull();
	});
});
