import { NextRequest, NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';
import _ from 'lodash';
import { verifyJwt } from '@/lib/jwt';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const postFilePath = path.join(process.cwd(), 'public/mocks/post.json');

export async function POST(
	req: NextRequest,
	params: { params: { postId: string } }
) {
	try {
		if (!req.cookies.get('accessToken')) {
			return NextResponse.redirect('/login', { status: 401 });
		}

		const user = verifyJwt(req.cookies.get('accessToken')?.value || '');

		if (!user) {
			cookies().delete('accessToken');

			return NextResponse.redirect('/login', { status: 401 });
		}

		// Step 1: read json file
		const posts = await fsPromises.readFile(postFilePath, 'utf-8');

		// Step 2: parse it into a JSON array
		let jsonArray = JSON.parse(posts);

		const index = jsonArray.findIndex(
			(p: Record<string, any>) => p.id == params.params.postId
		);

		console.log(index, index > -1);

		if (index < 0) {
			return new NextResponse(
				JSON.stringify({
					message: 'Post not found',
				}),
				{ status: 400, headers: { 'content-type': 'application/json' } }
			);
		}

		const post = _.cloneDeep(jsonArray[index]);

		const id = crypto.randomBytes(16).toString('hex');
		const { comment } = await req.json();
		const commentNew = {
			id,
			userName: user.userName,
			userId: user.id,
			comment,
		};

		post.comments.unshift(commentNew);

		jsonArray[index] = post;

		const updatedData = JSON.stringify(jsonArray);

		await fsPromises.writeFile(postFilePath, updatedData);

		return new NextResponse(JSON.stringify(post), {
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
