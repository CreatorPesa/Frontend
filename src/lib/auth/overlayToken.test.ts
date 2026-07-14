import { describe, expect, it } from 'vitest';
import { signOverlayToken, verifyOverlayToken } from './overlayToken';

const SECRET = 'test-secret-value-thats-long-enough';

describe('signOverlayToken / verifyOverlayToken', () => {
  it('verifies a token signed for the same creatorId', async () => {
    const token = await signOverlayToken('creator_123', SECRET);
    await expect(verifyOverlayToken('creator_123', token, SECRET)).resolves.toBe(true);
  });

  it('rejects the token when replayed against a different creatorId', async () => {
    const token = await signOverlayToken('creator_123', SECRET);
    await expect(verifyOverlayToken('creator_456', token, SECRET)).resolves.toBe(false);
  });
});
