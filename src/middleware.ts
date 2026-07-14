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
    // This only checks that a session cookie is present, not that it's
    // still valid — the backend that could confirm that isn't reachable
    // from the Edge runtime middleware executes in. A stale/expired cookie
    // still passes this check; the dashboard's own data fetch then 401s and
    // lands on its error boundary rather than bouncing back to /sign-in.
    // Acceptable for now since getServerSession() (src/lib/auth/session.ts)
    // is still the source of truth for every actual page render.
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
