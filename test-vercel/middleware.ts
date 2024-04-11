import { NextResponse, NextRequest } from "next/server";
import { checkUserLoggedIn } from "./library/account";

export function middleware(request: NextRequest) {
    if (!checkUserLoggedIn()) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).+)',
    ]
}