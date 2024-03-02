import { NextResponse } from 'next/server';

export async function middleware(request) {
    if (request.nextUrl.pathname === '/') {
        // Construct the redirect URL manually
        const redirectUrl = '/data';
        return NextResponse.redirect(redirectUrl);
    }

    // If the path is not '/', proceed with the next middleware
    return NextResponse.next();
}
