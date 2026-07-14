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

  it('rejects a tampered signature', async () => {
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

  it('rejects an expired token', async () => {
    const token = await signOverlayToken('creator_123', SECRET, -1);
    await expect(verifyOverlayToken('creator_123', token, SECRET)).resolves.toBe(false);
  });

  it('rejects a token with a tampered expiry', async () => {
    const token = await signOverlayToken('creator_123', SECRET);
    const [, signature] = token.split('.');
    const farFutureExpiry = 9999999999;
    await expect(
      verifyOverlayToken('creator_123', `${farFutureExpiry}.${signature}`, SECRET),
    ).resolves.toBe(false);
  });

  it('rejects a malformed token', async () => {
    await expect(verifyOverlayToken('creator_123', 'not-a-valid-token', SECRET)).resolves.toBe(
      false,
    );
  });
});
