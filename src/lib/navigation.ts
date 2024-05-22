'use server';

import { RedirectType, redirect } from 'next/navigation';

export async function navigate(url: string, option?: RedirectType) {
	redirect(url, option);
}
