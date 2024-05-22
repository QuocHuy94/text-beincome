import Image from 'next/image';
import { KeyboardEvent, useRef, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import LoadingScreen from '../LoadingScreen';

interface IItemPost {
	post: Record<string, any>;
	setPost: (post: Record<string, any>) => void;
}

const ItemPost = ({ post, setPost }: IItemPost) => {
	const refEditor = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);

	const handleAddComment = async () => {
		try {
			setLoading(true);
			const response = await await fetch(
				`/api/posts/${post.id}/comment`,
				{
					method: 'POST',
					headers: {
						contentType: 'application/json',
					},
					body: JSON.stringify({
						comment: refEditor.current?.innerHTML,
					}),
				}
			);

			if (response.status != 200) {
				throw response;
			}

			const postNew = await response.json();

			if (refEditor.current) refEditor.current.innerHTML = '';

			setPost(postNew);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.code === 'Enter' && !e.shiftKey) {
			handleAddComment();
		}
	};

	return (
		<>
			{loading && <LoadingScreen />}
			<div className='pb-4'>
				<div className='flex h-full w-full flex-col overflow-hidden rounded-lg bg-white'>
					<div className='flex items-center p-4'>
						<div>
							<Image
								alt='avatar'
								src='/assets/images/default-avatar.png'
								className='!box-border aspect-square h-full w-full object-cover overflow-hidden bg-neutral-1 border-neutral-1 border-[1.5px] rounded-full'
								width='38'
								height='38'
							/>
						</div>
						<div className='flex h-12 grow flex-col justify-evenly pl-2'>
							<div className='flex w-full items-center line-clamp-1 break-all text-neutral-80 hover:underline text-base font-semibold'>
								{post.userName}
							</div>
						</div>
					</div>
					<div className='w-full gap-y-2 px-4 pb-4'>
						{ReactHtmlParser(post.message)}
					</div>
					<div className='w-full'>
						<hr className='mx-4 mb-1 mt-2 bg-neutral-5' />
						<div className='flex h-fit w-full items-center justify-between py-2 px-4'>
							<div className='flex h-10 w-fit cursor-pointer items-center gap-x-2 rounded-full px-4 py-2 hover:bg-neutral-200'>
								<Image
									alt='like'
									src='/assets/images/like.svg'
									width={24}
									height={24}
								/>
								<div className='ml-1'>Like</div>
							</div>
							<div className='ml-auto'>
								{post.comments.length} comment(s)
							</div>
						</div>
						<hr className='mx-4 mb-1 mt-2 bg-neutral-5' />
					</div>
					<div className='p-4 w-full'>
						<div className='flex w-full space-x-2 pt-3'>
							<div className='h-fit w-fit py-3'>
								<Image
									alt='avatar'
									src='/assets/images/default-avatar.png'
									className='!box-border aspect-square h-full w-full object-cover overflow-hidden bg-neutral-1 border-neutral-1 border-[1.5px] rounded-full'
									width='38'
									height='38'
								/>
							</div>
							<div className='flex w-full flex-col rounded-lg bg-neutral-100 text-neutral-600'>
								<div
									className='min-h-20 border border-gray-300 rounded-lg p-4 outline-none whitespace-pre-wrap break-words text-sm'
									contentEditable
									ref={refEditor}
									onKeyDown={handleKeyDown}
								></div>
							</div>
						</div>
						{post.comments.map((comment: Record<string, any>) => (
							<div className='flex w-full space-x-2 pt-3'>
								<div className='h-fit w-fit py-3'>
									<Image
										alt='avatar'
										src='/assets/images/default-avatar.png'
										className='!box-border aspect-square h-full w-full object-cover overflow-hidden bg-neutral-1 border-neutral-1 border-[1.5px] rounded-full'
										width='38'
										height='38'
									/>
								</div>
								<div className='flex w-full flex-col rounded-lg bg-neutral-100 text-neutral-600'>
									<div className='flex w-full flex-col '>
										<div className='ml-4 mt-2 flex justify-between text-base font-semibold'>
											{comment.userName}
										</div>
									</div>
									<div className='mx-4 mb-3'>
										<div className='relative overflow-hidden transition-all duration-200'>
											{ReactHtmlParser(comment.comment)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default ItemPost;
