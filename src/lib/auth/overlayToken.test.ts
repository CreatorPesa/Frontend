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

  it('rejects a tampered token', async () => {
    const token = await signOverlayToken('creator_123', SECRET);
    const tampered = `${token.slice(0, -1)}${token.at(-1) === '0' ? '1' : '0'}`;
    await expect(verifyOverlayToken('creator_123', tampered, SECRET)).resolves.toBe(false);
  });

  it('rejects a token signed with a different secret', async () => {
    const token = await signOverlayToken('creator_123', SECRET);
    await expect(verifyOverlayToken('creator_123', token, 'a-different-secret')).resolves.toBe(
      false,
    );
  });
});
