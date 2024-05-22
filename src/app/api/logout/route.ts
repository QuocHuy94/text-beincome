import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		cookies().delete('accessToken');

		return new NextResponse('', {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		});
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: 'Error logout fail!',
			}),
			{ status: 500, headers: { 'content-type': 'application/json' } }
		);
	}
}
