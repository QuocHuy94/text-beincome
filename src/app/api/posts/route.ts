import { NextRequest, NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';
import _ from 'lodash';
import { getPosts } from '@/lib/getPosts';

const postFilePath = path.join(process.cwd(), 'public/mocks/post.json');

export async function GET(req: NextRequest) {
	try {
		if (!req.cookies.get('accessToken')) {
			return NextResponse.redirect('/login', { status: 401 });
		}

		const searchParams = new URLSearchParams(req.url.split('?')[1]);
		const search = searchParams.get('search') || '';
		const page = +(searchParams.get('page') || 0);

		const posts = await getPosts({ page, search });

		if (posts.message) throw new Error(posts.message);

		return new NextResponse(JSON.stringify(posts), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		});
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: 'Error reading or parsing the JSON file!',
			}),
			{ status: 500, headers: { 'content-type': 'application/json' } }
		);
	}
}
