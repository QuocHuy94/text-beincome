import classNames from 'classnames';
import Image from 'next/image';
import React, { useState } from 'react';
import {
	Control,
	Controller,
	FieldValues,
	RegisterOptions,
} from 'react-hook-form';

type Props = {
	label?: string | React.ReactNode | any;
	name: string;
	control: Control<any>;
	rules?: Omit<
		RegisterOptions<FieldValues, string>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>;
	inputProps?: any;
	selectProps?: any;
	wrapperClassName?: string;
	type?: 'horizontal' | 'vertical';
	inputType?: string;
	prefix?: string;
	pattern?: RegExp;
	suffix?: React.ReactNode | string;
	suffixClass?: string;
	isTooltip?: boolean;
	tooltipMessage?: string;
	defaultValue?: any;
};

function InputField({
	label = '',
	name,
	control,
	rules,
	inputProps = {},
	wrapperClassName = '',
	type = 'vertical',
	inputType = 'text',
	pattern,
	defaultValue,
}: Props) {
	const isPasswordField = inputType === 'password';
	const [typeOfInput, setTypeOfInput] = useState(inputType);
	const { maxLength, isShowRequiredStart, onBeforeChange, ...otherProps } =
		inputProps;

	const handleEyeClick = () => {
		setTypeOfInput(typeOfInput === 'password' ? 'text' : 'password');
	};

	const handleChange =
		(field: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event?.target?.value;
			const regexp = pattern ? new RegExp(pattern) : null;
			const isValid = regexp?.test(newValue);

			const next = (changedValue?: string) => {
				field.onChange(changedValue ?? newValue);
				otherProps?.onChange?.(changedValue ?? newValue);
			};

			if (regexp !== null && !isValid) {
				return;
			}
			if (onBeforeChange) {
				onBeforeChange(newValue, next);

				return;
			}

			next();
		};

	const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		otherProps?.onBlur?.(e);
	};

	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			defaultValue={defaultValue}
			render={({ field, fieldState: { error } }) => {
				const isInvalid = Boolean(error?.message);

				return (
					<div
						className={classNames(
							'w-full relative',
							type,
							wrapperClassName
						)}
					>
						{label && (
							<label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
								{label}
								{isShowRequiredStart && (
									<span className='start'> *</span>
								)}
							</label>
						)}
						<div className='w-full relative'>
							<input
								className={classNames(
									'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block',
									'w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
									{
										'pr-10': isPasswordField,
										'border-red-500': isInvalid,
									}
								)}
								invalid={isInvalid}
								id={name}
								type={typeOfInput}
								maxLength={maxLength}
								{...otherProps}
								{...field}
								style={otherProps.style}
								onChange={handleChange(field)}
								onBlur={handleOnBlur}
							/>
							{isPasswordField && (
								<div
									className='absolute top-1/2 right-2 -translate-y-1/2'
									onClick={handleEyeClick}
								>
									<Image
										src={
											typeOfInput === 'password'
												? '/assets/images/eye-slash.svg'
												: '/assets/images/eye.svg'
										}
										alt='eye'
										width={20}
										height={20}
									/>
								</div>
							)}
						</div>
						{isInvalid && (
							<div className='text-red-500'>{error?.message}</div>
						)}
					</div>
				);
			}}
		/>
	);
}

export default InputField;
