import classNames from 'classnames';
import Image from 'next/image';
import React, { KeyboardEvent, useRef } from 'react';

interface IInputSearch {
	onChange?: (value: string) => void;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>, value: string) => void;
}

const InputSearch = ({ onChange, onKeyDown }: IInputSearch) => {
	const ref = useRef<HTMLInputElement>(null);

	const handleChange =
		(field: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event?.target?.value;

			const next = (changedValue?: string) => {
				onChange?.(changedValue ?? newValue);
			};

			next();
		};

	return (
		<div className='w-full relative'>
			<input
				ref={ref}
				className={classNames(
					'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10',
					'w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
				)}
				onChange={handleChange}
				placeholder='search'
				onKeyDown={e => onKeyDown?.(e, ref.current?.value || '')}
			/>
			<div className='absolute top-1/2 left-2 -translate-y-1/2'>
				<Image
					src='/assets/images/search.svg'
					alt='search'
					width={20}
					height={20}
				/>
			</div>
		</div>
	);
};

export default InputSearch;
