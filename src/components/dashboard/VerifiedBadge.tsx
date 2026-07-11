import { Badge } from '@/components/ui/Badge';

export function VerifiedBadge({ isVerified }: { isVerified: boolean }) {
  if (!isVerified) {
    return <Badge tone="warning">Unverified</Badge>;
  }
  return <Badge tone="success">✓ Verified on-chain</Badge>;
}
