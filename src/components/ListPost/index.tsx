'use client';

import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useSearchParams } from 'next/navigation';
import { LegacyRef, useEffect, useRef, useState } from 'react';
import ItemPost from './ItemPost';
import Loading from '../Loading';
import LoadingScreen from '../LoadingScreen';
import _ from 'lodash';

const ListPost = ({
	totalPost,
	defaultPosts,
}: {
	defaultPosts: Array<Record<string, any>>;
	totalPost: number;
}) => {
	const [posts, setPosts] = useState(defaultPosts);
	const [page, setPage] = useState(0);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isMaxSize, setIsMaxSize] = useState(
		Math.ceil((totalPost || 0) / 10) === page + 1
	);
	const searchParams = useSearchParams();
	const refMount = useRef(false);

	const onLoadMore = async (pageNew: number) => {
		setIsLoadingMore(false);
		try {
			const result = await fetch(
				'/api/posts?' +
					new URLSearchParams({
						search: searchParams.get('search') || '',
						page: pageNew.toString(),
					}),
				{
					method: 'GET',
					headers: {
						contentType: 'application/json',
					},
				}
			);

			const response = await result.json();

			if (result.status !== 200) {
				throw response;
			}

			const newPosts = Boolean(pageNew)
				? [...posts, ...response.posts]
				: response.posts;

			setPosts(newPosts);
			setPage(pageNew);
			setIsMaxSize(
				Math.ceil((response.totalPost || 0) / 10) === pageNew + 1
			);
		} catch (error) {
		} finally {
			setIsLoadingMore(false);
		}
	};

	useEffect(() => {
		if (!refMount.current) return;

		onLoadMore(0);
	}, [searchParams.get('search')]);

	useEffect(() => {
		refMount.current = true;
	}, []);

	const handleLoadMore = () => {
		if (!isLoadingMore && !isMaxSize) {
			onLoadMore(page + 1);
		}
	};

	const setPostNew = (postNew: Record<string, any>, index: number) => {
		const clonePosts = _.cloneDeep(posts);

		clonePosts[index] = postNew;
		setPosts(clonePosts);
	};

	return (
		<>
			<Posts
				posts={posts}
				onLoadMore={handleLoadMore}
				setPost={setPostNew}
			/>
			{isLoadingMore && <Loading />}
		</>
	);
};

export default ListPost;

const Posts = ({
	posts,
	onLoadMore,
	setPost,
}: {
	posts: Record<string, any>[];
	onLoadMore: () => void;
	setPost: (post: Record<string, any>, index: number) => void;
}) => {
	const dummyElementRef: LegacyRef<HTMLTableRowElement> | undefined =
		useRef<HTMLTableRowElement>(null);
	const entry = useIntersectionObserver(dummyElementRef, { threshold: 0.3 });

	const isVisible = !!entry?.isIntersecting;

	useEffect(() => {
		if (isVisible) {
			onLoadMore();
		}
	}, [isVisible]);

	return posts.map((post: Record<string, any>, index: number) => (
		<div
			className='w-full'
			ref={index === posts.length - 1 ? dummyElementRef : null}
		>
			<ItemPost
				post={post}
				setPost={postNew => setPost(postNew, index)}
			/>
		</div>
	));
};
