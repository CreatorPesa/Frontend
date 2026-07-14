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
});
