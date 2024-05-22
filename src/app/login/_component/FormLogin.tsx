'use client';

import InputField from '@/components/InputField';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface IFormLogin {
	email: string;
	password: string;
}

const validateLogin = yup.object({
	email: yup.string().required().email(),
	password: yup.string().required(),
});

export default function FormLogin() {
	const methods = useForm<IFormLogin>({
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onSubmit',
		resolver: yupResolver(validateLogin),
	});
	const router = useRouter();

	const handleSubmit = useCallback(async (values: IFormLogin) => {
		try {
			const result = await fetch('/api/login', {
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
				case 'error.email.not.found':
					methods.setError('email', {
						message: 'This email does not exist',
					});
					break;
				case 'error.password.invalid':
					methods.setError('password', {
						message: "Password don't match",
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
				<div className='text-2xl font-semibold'>Welcome back!</div>
				<h3 className='mt-2'>
					Enter your credentials to access your account.
				</h3>
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
					name='password'
					inputType='password'
					label='Password'
					wrapperClassName='mt-4'
				/>
				<div className='mt-2'>
					<Link className='text-blue-500' href='/forgot-password'>
						Forgot password?
					</Link>
				</div>
				<button className='bg-purple-700 p-4 w-full mt-2 rounded-lg hover:bg-purple-600 text-white'>
					Log in
				</button>
			</form>
			<div className='flex flex-col align-center justify-center mt-4'>
				<div className='text-neutral-40 text-center'>
					Don’t have an account?&nbsp;
					<Link className='text-blue-500' href='/sign-up'>
						Sign up
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
							'disabled:text-gray-400 bg-neutral-20 text-neutral-600 hover:bg-neutral-500 border',
							'border-neutral-500 bg-transparent hover:border-white disabled:border-white'
						)}
					>
						Facebook
					</button>
					<button
						className={classNames(
							'relative flex items-center justify-center space-x-2 whitespace-nowrap rounded-md font-medium transition-colors',
							'disabled:!cursor-not-allowed focus-visible:outline-neutral-20 active:ring-neutral-20 h-12 px-4 py-2',
							'text-base focus-visible:outline-[3px] active:ring-[3px] disabled:bg-gray-500',
							'disabled:text-gray-400 bg-neutral-20 text-neutral-600 hover:bg-neutral-500 border',
							'border-neutral-500 bg-transparent hover:border-white disabled:border-white'
						)}
					>
						Google
					</button>
				</div>
			</div>
		</>
	);
}
