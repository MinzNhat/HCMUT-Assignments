import { NextResponse } from 'next/server';

export const config = {
    matcher: '/',
};

export default function middleware(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
        url.pathname = '/data';
    }

    return NextResponse.rewrite(request.url);
}