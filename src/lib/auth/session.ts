import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { apiFetch, ApiError } from '@/lib/api/client';

export interface Session {
  userId: string;
  creatorId: string | null;
  email: string;
  displayName: string;
}

/**
 * Auth & identity (Google OAuth, YouTube channel verification) lives in the
 * `backend` repo — this frontend only reads the session cookie the backend
 * issues and asks the backend to validate it.
 */
export async function getServerSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(env.NEXT_PUBLIC_SESSION_COOKIE_NAME);
  if (!sessionCookie) return null;

  try {
    return await apiFetch<Session>('/auth/session', {
      cookie: `${sessionCookie.name}=${sessionCookie.value}`,
    });
  } catch (err) {
    // A 401 means the cookie is missing/expired — genuinely logged out.
    // Anything else (backend down, network failure, 5xx) is an outage, not a
    // logout, so it's rethrown for the caller to handle rather than silently
    // treated as "not signed in" — that distinction matters most in
    // src/app/dashboard/layout.tsx, which would otherwise bounce an
    // authenticated creator to the sign-in page during a backend hiccup.
    if (err instanceof ApiError && err.status === 401) {
      return null;
    }
    throw err;
  }
}

export function googleSignInUrl(redirectTo: string): string {
  const params = new URLSearchParams({ redirectTo });
  return `${env.NEXT_PUBLIC_API_URL}/auth/google?${params.toString()}`;
}

export function signOutUrl(): string {
  return `${env.NEXT_PUBLIC_API_URL}/auth/sign-out`;
}
