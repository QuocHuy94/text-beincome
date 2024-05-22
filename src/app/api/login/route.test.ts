import { expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { signJwtAccessToken } from '@/lib/jwt'; // Assuming this is a custom function
import path from 'path';
import fsPromises from 'fs/promises';
import { POST } from './route';
import { JwtPayload } from 'jsonwebtoken';

const userFilePath = path.join(process.cwd(), 'public/mocks/user.json');

// Mock fsPromises.readFile
vi.mock('fs/promises');

async function mockReadFile(
	filePath: string,
	encoding: string
): Promise<string> {
	if (filePath === userFilePath) {
		return JSON.stringify([
			{
				// Mock user data
				email: 'testuser@example.com',
				password: 'securepassword',
				// ... other user properties
			},
		]);
	}
	throw new Error(`File not found: ${filePath}`);
}

vi.mock('@/lib/jwt', () => ({
	signJwtAccessToken: (payload: JwtPayload) => '23123123',
}));

vi.mock('next/headers', async importOriginal => {
	return {
		cookies: () => {
			return {
				get: (name: string) => {
					return {
						value: 'cookie',
					};
				},
				set: (value: any) => {},
			};
		},
	};
});

(fsPromises.readFile as any).mockImplementation(mockReadFile);

test('POST /api/login (valid credentials)', async () => {
	const req: NextRequest = new NextRequest(
		new URL('/api/login', 'http://localhost'),
		{
			body: JSON.stringify({
				email: 'testuser@example.com',
				password: 'securepassword',
			}),
			method: 'POST',
		}
	);
	req.headers.set('content-type', 'application/json');

	const res: NextResponse = await POST(req);

	console.log(res);

	expect(res.status).toBe(200);
	expect(res.headers.get('content-type')).toBe('application/json');

	const data: { email: string; password?: string; accessToken: string } =
		JSON.parse(await res.text());
	expect(data.email).toBe('testuser@example.com'); // Assuming email is not sensitive
	expect(data.password).toBeUndefined(); // Don't test password in response
	expect(data.accessToken).toBeDefined(); // Verify token presence

	// Optionally, you can mock signJwtAccessToken if needed:
	// const mockSignJwtAccessToken = vi.fn().mockReturnValue('mocked-access-token');
	// vi.mock('@/lib/jwt', { signJwtAccessToken: mockSignJwtAccessToken });
	// expect(mockSignJwtAccessToken).toHaveBeenCalled(); // Assert JWT signing was called
});

test('POST /api/login (invalid email)', async () => {
	const req: NextRequest = new NextRequest(
		new URL('/api/login', 'http://localhost'),
		{
			body: JSON.stringify({
				email: 'invalid@example.com',
				password: 'securepassword',
			}),
			method: 'POST',
		}
	);
	req.headers.set('content-type', 'application/json');

	const res: NextResponse = await POST(req);

	expect(res.status).toBe(401);
	expect(res.headers.get('content-type')).toBe('application/json');

	const data: { message: string; errorKey: string } = JSON.parse(
		await res.text()
	);
	expect(data.message).toBe('Email error');
});

test('POST /api/login (invalid password)', async () => {
	const req: NextRequest = new NextRequest(
		new URL('/api/login', 'http://localhost'),
		{
			body: JSON.stringify({
				email: 'testuser@example.com',
				password: 'wrongpassword',
			}),
			method: 'POST',
		}
	);
	req.headers.set('content-type', 'application/json');

	const res: NextResponse = await POST(req);

	expect(res.status).toBe(401);
	expect(res.headers.get('content-type')).toBe('application/json');

	const data: { message: string; errorKey: string } = JSON.parse(
		await res.text()
	);
	expect(data.message).toBe('Password error');
});

test('POST /api/login (file read error)', async () => {
	// Simulate file read error by modifying mock
	(fsPromises.readFile as any).mockImplementationOnce(
		mockReadFile.bind(null, 'non-existent-file.json')
	);

	const req: NextRequest = new NextRequest(
		new URL('/api/login', 'http://localhost'),
		{
			body: JSON.stringify({
				email: 'testuser@example.com',
				password: 'securepassword',
			}),
			method: 'POST',
		}
	);
	req.headers.set('content-type', 'application/json');

	const res: NextResponse = await POST(req);

	expect(res.status).toBe(500);
	expect(res.headers.get('content-type')).toBe('application/json');

	const data = JSON.parse(await res.text());
	expect(data.message).toContain('Error reading or parsing the JSON file!');
});
