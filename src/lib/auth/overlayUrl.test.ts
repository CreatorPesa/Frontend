import { describe, expect, it } from 'vitest';
import { buildSignedOverlayUrl } from './overlayUrl';
import { verifyOverlayToken } from './overlayToken';

const SECRET = 'test-secret-value-thats-long-enough';

describe('buildSignedOverlayUrl', () => {
  it('builds a /overlay/:creatorId URL carrying a verifiable token', async () => {
    const url = await buildSignedOverlayUrl('https://creatorpesa.app', 'creator_123', SECRET);
    const parsed = new URL(url);

    expect(parsed.pathname).toBe('/overlay/creator_123');
    const token = parsed.searchParams.get('token');
    expect(token).toBeTruthy();
    await expect(verifyOverlayToken('creator_123', token ?? '', SECRET)).resolves.toBe(true);
  });
});
