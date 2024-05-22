'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { KeyboardEvent, useCallback } from 'react';
import InputSearch from '../InputSearch';
import { useRouter } from 'next/navigation';

const AppBar = () => {
	const router = useRouter();

	const onClickLogOut = useCallback(async () => {
		try {
			const result = await fetch('/api/logout', {
				method: 'POST',
				headers: {
					contentType: 'application/json',
				},
			});

			if (result.status !== 200) {
				throw new Error();
			}

			router.push('/login');
		} catch (error) {}
	}, []);

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, value: string) => {
		if (e.code === 'Enter') {
			router.push('/?' + new URLSearchParams({ search: value }));
		}
	};

	return (
		<header className='sticky top-0 z-[100] h-navbar w-screen gap-x-6 border-b bg-white px-6 py-2 shadow-1 flex items-center justify-center xl:gap-x-12 xl:px-12'>
			<div className='min-w-[280px] max-w-[320px] grow flex justify-end md:justify-start'>
				<Link
					href='/'
					className='flex items-center justify-center gap-x-1.5'
				>
					<Image
						alt='logo'
						src='https://group.beincom.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_beincomm_icon_only.12cfcb79.webp&w=64&q=75'
						width={28}
						height={28}
					/>
					<Image
						alt='company name'
						src='https://group.beincom.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_beincomm_text_only.20ab3824.webp&w=256&q=75'
						height={28}
						width={120}
					/>
				</Link>
			</div>
			<div className='hidden h-full min-w-[320px] max-w-[672px] xl:block'>
				<InputSearch onKeyDown={onKeyDown} />
			</div>
			<div className='flex h-full w-full min-w-[280px] max-w-[320px] grow items-center justify-center gap-x-3 md:justify-end'>
				<button onClick={onClickLogOut}>Log out</button>
			</div>
		</header>
	);
};

export default AppBar;
