import fsPromises from 'fs/promises';
import path from 'path';
import _ from 'lodash';

const postFilePath = path.join(process.cwd(), 'public/mocks/post.json');

const PAGE_SIZE = 10;

export const getPosts = async ({
	search,
	page = 1,
}: {
	search?: string;
	page?: number;
}) => {
	try {
		// Step 1: read json file
		const posts = await fsPromises.readFile(postFilePath, 'utf-8');

		// Step 2: parse it into a JSON array
		let jsonArray = JSON.parse(posts);

		if (search) {
			jsonArray = jsonArray.filter((i: Record<string, any>) =>
				i.message.includes(search)
			);
		}

		return {
			posts: jsonArray.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
			totalPost: jsonArray.length,
		};
	} catch (err) {
		return { message: 'Error reading or parsing the JSON file!' };
	}
};
