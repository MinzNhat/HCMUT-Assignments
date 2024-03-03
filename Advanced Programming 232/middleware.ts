import { rewrite } from '@vercel/edge';
 
export default function middleware(request: Request) {
  const url = new URL(request.url);
 
  if (url.pathname.startsWith('/')) {
    return rewrite(new URL('/data', request.url));
  }
}
