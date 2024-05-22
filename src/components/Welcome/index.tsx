import Image from 'next/image';
import React from 'react';

export default function Welcome({
	children,
}: {
	children: React.ReactNode | React.ReactElement;
}) {
	return (
		<div className='flex h-screen overflow-auto overflow-x-hidden'>
			<div className='w-2/4 hidden md:block relative h-screen'>
				<Image
					alt='beincom-bg'
					decoding='async'
					src='https://group.beincom.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbackground_sign_in.a3fee7b3.webp&amp;w=3840&amp;q=75'
					className='absolute top-0 left-0 w-full h-screen'
					width={60}
					height={100}
				/>
				<div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full z-10 px-16'>
					<div className='mb-11 w-full'>
						<Image
							src='/assets/images/logo.svg'
							alt='logo'
							width={1200}
							height={100}
						/>
					</div>
					<div>
						<Image
							src='/assets/images/welcome.svg'
							alt='welcome'
							width={1200}
							height={100}
						/>
					</div>
				</div>
			</div>
			<div className='w-full md:w-2/4 p-6 flex align-center justify-center bg-white'>
				<div className='my-auto max-w-md min-w-80 flex flex-col align-center justify-center'>
					{children}
				</div>
			</div>
		</div>
	);
}
