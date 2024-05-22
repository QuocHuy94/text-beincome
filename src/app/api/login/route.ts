import { NextRequest, NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';
import _ from 'lodash';
import { signJwtAccessToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

const userFilePath = path.join(process.cwd(), 'public/mocks/user.json');

export async function POST(req: NextRequest) {
	try {
		// Step 1: read json file
		const users = await fsPromises.readFile(userFilePath, 'utf-8');

		// Step 2: parse it into a JSON array
		const jsonArray = JSON.parse(users);

		// Step 3: destructure values from request body
		const { email, password } = await req.json();
		const user = jsonArray.find(
			(u: Record<string, any>) => u.email === email
		);

		if (_.isEmpty(user)) {
			return new NextResponse(
				JSON.stringify({
					message: 'Email error',
					errorKey: 'error.email.not.found',
				}),
				{
					status: 401,
					headers: { 'content-type': 'application/json' },
				}
			);
		}

		if (password !== user.password) {
			return new NextResponse(
				JSON.stringify({
					message: 'Password error',
					errorKey: 'error.password.invalid',
				}),
				{
					status: 401,
					headers: { 'content-type': 'application/json' },
				}
			);
		}

		const accessToken = signJwtAccessToken(_.omit(user, ['password']));

		cookies().set({
			name: 'accessToken',
			value: accessToken,
			httpOnly: true,
			path: '/',
			sameSite: 'strict',
		});

		return new NextResponse(
			JSON.stringify({ ..._.omit(user, ['password']), accessToken }),
			{
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			}
		);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: 'Error reading or parsing the JSON file!',
			}),
			{ status: 500, headers: { 'content-type': 'application/json' } }
		);
	}
}
