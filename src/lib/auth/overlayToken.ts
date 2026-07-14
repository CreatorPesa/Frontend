const encoder = new TextEncoder();

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Constant-time string comparison — a plain `===` here would leak the
 * correct token one byte at a time via response-timing, defeating the point
 * of signing the overlay URL in the first place.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** ~180 days — long enough that a creator pastes the URL into OBS once and
 * forgets about it, short enough that a leaked link doesn't stay valid
 * forever. The settings page re-signs a fresh token on every render, so a
 * creator who revisits Settings keeps rolling their expiry forward. */
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 180;

/**
 * Signs a creator's OBS overlay URL so the browser-source link can't be
 * guessed from a raw creatorId or scraped and replayed by a third party.
 * Uses Web Crypto (not Node's `crypto` module) so it runs in both server
 * components and the Edge runtime that middleware.ts executes in.
 *
 * The token carries its own expiry (`${expiresAt}.${signature}`) rather than
 * being a bare signature over creatorId — a bare signature is identical
 * forever, so a single leak (screen share, OBS log, browser history) would
 * be a permanent, unrevocable credential short of rotating the secret for
 * every creator at once. Middleware is stateless Edge code with no backend
 * to check a "used token" store against, so bounding the token's lifetime is
 * the only replay mitigation available at this layer.
 */
export async function signOverlayToken(
  creatorId: string,
  secret: string,
  ttlSeconds = DEFAULT_TTL_SECONDS,
): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const signature = await hmacHex(secret, `${creatorId}.${expiresAt}`);
  return `${expiresAt}.${signature}`;
}

export async function verifyOverlayToken(
  creatorId: string,
  token: string,
  secret: string,
): Promise<boolean> {
  const separatorIndex = token.indexOf('.');
  if (separatorIndex === -1) return false;

  const expiresAtRaw = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return false;

  const expected = await hmacHex(secret, `${creatorId}.${expiresAtRaw}`);
  return timingSafeEqual(expected, signature);
}
