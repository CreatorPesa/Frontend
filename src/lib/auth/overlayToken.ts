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

/**
 * Signs a creator's OBS overlay URL so the browser-source link can't be
 * guessed from a raw creatorId or scraped and replayed by a third party.
 * Uses Web Crypto (not Node's `crypto` module) so it runs in both server
 * components and the Edge runtime that middleware.ts executes in.
 */
export async function signOverlayToken(creatorId: string, secret: string): Promise<string> {
  return hmacHex(secret, creatorId);
}

export async function verifyOverlayToken(
  creatorId: string,
  token: string,
  secret: string,
): Promise<boolean> {
  const expected = await hmacHex(secret, creatorId);
  return timingSafeEqual(expected, token);
}
