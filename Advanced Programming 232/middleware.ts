import { NextResponse } from 'next/server';

export async function middleware(request: any) {
    if (request.nextUrl.pathname === '/') {
        const redirectUrl = new URL('/data', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}
