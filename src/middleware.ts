import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? 'cp_session';
const HANDLE_PATTERN = /^\/@([a-zA-Z0-9_-]+)$/;

/**
 * Public tip pages are shared as creatorpesa.app/@handle, but Next.js
 * reserves a leading `@` in the app directory for parallel route slots, so
 * the real route lives at /creator/[handle] and this rewrite maps the
 * public URL onto it.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const handleMatch = pathname.match(HANDLE_PATTERN);
  if (handleMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/creator/${handleMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith('/dashboard')) {
    const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
    if (!hasSession) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = '/sign-in';
      signInUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/@:handle*', '/dashboard/:path*'],
};
