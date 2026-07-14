import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from './client';

describe('apiFetch', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns parsed JSON on a 2xx response', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await expect(apiFetch('/ping')).resolves.toEqual({ ok: true });
  });

  it('throws ApiError with the response body on a non-2xx response', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ message: 'nope' }), { status: 400 }));

    await expect(apiFetch('/ping')).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
    });
  });

  it('aborts the underlying fetch once the default timeout elapses', async () => {
    vi.useFakeTimers();
    global.fetch = vi.fn((_url, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () =>
          reject(new DOMException('Aborted', 'AbortError')),
        );
      });
    });

    const pending = apiFetch('/slow');
    const assertion = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    await vi.advanceTimersByTimeAsync(15_000);
    await assertion;
    vi.useRealTimers();
  });
});
