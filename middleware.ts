import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Mock auth check: allow all for now while developing, 
    // but normally we would check supabase session here.
    const isAdminPath = request.nextUrl.pathname.startsWith('/dashboard');

    if (isAdminPath) {
        // Validate auth
        // return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
