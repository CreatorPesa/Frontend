import { env } from '@/lib/env';

const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  /** Forward the caller's cookies when invoked from a server component. */
  cookie?: string;
}

/**
 * Thin fetch wrapper around the `backend` repo's REST API. Credentials are
 * sent via cookie (the session issued after Google OAuth) rather than a
 * bearer token, so `credentials: 'include'` is required on every call.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    signal: options.signal,
    headers: {
      'Content-Type': 'application/json',
      ...(options.cookie ? { cookie: options.cookie } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new ApiError(`Request to ${path} failed with ${res.status}`, res.status, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
