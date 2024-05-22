import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRoutes, protectedRoutes } from './router/routes';

export function middleware(request: NextRequest) {
	const currentUser = request.cookies.get('accessToken')?.value;

	if (protectedRoutes.includes(request.nextUrl.pathname) && !currentUser) {
		const response = NextResponse.redirect(new URL('/login', request.url));

		return response;
	}

	if (authRoutes.includes(request.nextUrl.pathname) && currentUser) {
		return NextResponse.redirect(new URL('/', request.url));
	}
}
