import { NextResponse } from 'next/server';

export async function middleware(request: any) {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname === '/') {
        const redirectUrl = new URL('/data', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}
