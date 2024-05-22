'use client';

import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '@/components/InputField';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface IFormSignUp {
	email: string;
	password: string;
	userName: string;
	fullName: string;
}

const validateLogin = yup.object({
	email: yup.string().required().email(),
	password: yup.string().required(),
	userName: yup
		.string()
		.required()
		.test(
			'len',
			'User name must be between 3 to 50 characters',
			val => val.length >= 3 && val.length <= 50
		),
	fullName: yup
		.string()
		.required()
		.matches(/\b[^\d\W]+\b/g, 'Full name can not contain numbers')
		.test(
			'len',
			'Full name must be between 3 to 64 characters',
			val => val.length >= 3 && val.length <= 64
		),
});

const SignUp = () => {
	const methods = useForm<IFormSignUp>({
		defaultValues: {
			email: '',
			password: '',
			userName: '',
			fullName: '',
		},
		mode: 'onSubmit',
		resolver: yupResolver(validateLogin),
	});
	const router = useRouter();

	const handleSubmit = useCallback(async (values: IFormSignUp) => {
		try {
			const result = await fetch('/api/user', {
				method: 'POST',
				headers: {
					contentType: 'application/json',
				},
				body: JSON.stringify(values),
			});

			const response = await result.json();

			if (response.errorKey) {
				throw response;
			}

			router.push('/');
		} catch (error: any) {
			switch (error?.errorKey) {
				case 'error.email.existed':
					methods.setError('email', {
						message: 'This email existed',
					});
					break;
				default:
					break;
			}
		}
	}, []);

	return (
		<>
			<div className='w-full'>
				<div className='text-2xl font-semibold'>Welcome</div>
			</div>
			<form
				className='w-full'
				onSubmit={methods.handleSubmit(handleSubmit)}
			>
				<InputField
					control={methods.control}
					name='email'
					label='Email'
					wrapperClassName='mt-4'
				/>
				<InputField
					control={methods.control}
					name='fullName'
					label='Full Name'
					wrapperClassName='mt-4'
				/>
				<InputField
					control={methods.control}
					name='userName'
					label='User Name'
					wrapperClassName='mt-4'
				/>
				<InputField
					control={methods.control}
					name='password'
					inputType='password'
					label='Password'
					wrapperClassName='mt-4'
				/>
				<button className='bg-purple-700 p-4 w-full mt-2 rounded-lg hover:bg-purple-600 text-white'>
					Sign Up
				</button>
			</form>
			<div className='flex flex-col align-center justify-center mt-4'>
				<div className='text-neutral-40 text-center'>
					Already have an account?&nbsp;
					<Link className='text-blue-500' href='/login'>
						Sign in
					</Link>
				</div>
				<div className='flex w-full items-center before:h-px before:w-full before:bg-neutral-500 after:h-px after:w-full after:bg-neutral-500'>
					<div className='mx-3 min-w-fit'>or login in with</div>
				</div>
				<div className='flex gap-3 items-center justify-center mt-4 w-full'>
					<button
						className={classNames(
							'relative flex items-center justify-center space-x-2 whitespace-nowrap rounded-md font-medium transition-colors',
							'disabled:!cursor-not-allowed focus-visible:outline-neutral-20 active:ring-neutral-20 h-12 px-4 py-2',
							'text-base focus-visible:outline-[3px] active:ring-[3px] disabled:bg-gray-500',
							'disabled:text-gray-400 bg-neutral-20 text-neutral-600 hover:bg-neutral-500 border border-neutral-500 bg-transparent hover:border-white disabled:border-white'
						)}
					>
						Facebook
					</button>
					<button
						className={classNames(
							'relative flex items-center justify-center space-x-2 whitespace-nowrap rounded-md font-medium transition-colors',
							'disabled:!cursor-not-allowed focus-visible:outline-neutral-20 active:ring-neutral-20 h-12 px-4 py-2',
							'text-base focus-visible:outline-[3px] active:ring-[3px] disabled:bg-gray-500',
							'disabled:text-gray-400 bg-neutral-20 text-neutral-600 hover:bg-neutral-500 border border-neutral-500 bg-transparent hover:border-white disabled:border-white'
						)}
					>
						Google
					</button>
				</div>
			</div>
		</>
	);
};

export default SignUp;
