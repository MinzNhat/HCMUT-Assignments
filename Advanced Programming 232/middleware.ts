export async function middleware(request: any) {
    if (request.url === '/') {
        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/data'
            }
        });
    }
}
