import React from 'react';

const LoadingScreen = () => {
	return (
		<div className='absolute top-0 left-0 z-[10] flex justify-center items-center h-screen bg-white bg-opacity-60 w-screen'>
			<div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500'></div>
		</div>
	);
};

export default LoadingScreen;
