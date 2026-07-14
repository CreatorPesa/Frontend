import { signOverlayToken } from '@/lib/auth/overlayToken';

/**
 * The URL a creator pastes into OBS as a Browser Source. Signed so the link
 * itself is the credential — middleware.ts verifies the token before the
 * overlay route renders anything for that creatorId.
 */
export async function buildSignedOverlayUrl(
  baseUrl: string,
  creatorId: string,
  secret: string,
): Promise<string> {
  const token = await signOverlayToken(creatorId, secret);
  return `${baseUrl}/overlay/${creatorId}?token=${token}`;
}
