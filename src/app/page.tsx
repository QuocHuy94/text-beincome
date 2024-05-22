import AppBar from '@/components/AppBar';
import ListPost from '@/components/ListPost';
import { getPosts } from '@/lib/getPosts';

export default async function Home({ searchParams }: { searchParams: any }) {
	const { search } = searchParams || {};

	async function getPost() {
		const posts = await getPosts({ search });

		return posts;
	}

	const { posts, totalPost } = await getPost();

	return (
		<>
			<div className='overflow-x-hidden overflow-y-auto h-screen'>
				<AppBar />
				<main className='flex items-start justify-center gap-x-6 px-4 p-4 xl:px-24 h-full'>
					<aside className='hidden min-w-[280px] max-w-[320px] grow xl:block'></aside>
					<div className='min-w-[320px] max-w-[672px] w-full pt-0 p-6 h-full'>
						<ListPost defaultPosts={posts} totalPost={totalPost} />
					</div>
					<aside className='hidden min-w-[280px] max-w-[320px] grow xl:block'></aside>
				</main>
			</div>
		</>
	);
}
