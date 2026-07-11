import { apiFetch } from '@/lib/api/client';
import type { MembershipTier } from '@/types/creator';

export function updateMembershipTiers(creatorId: string, tiers: MembershipTier[]) {
  return apiFetch<MembershipTier[]>(`/creators/${creatorId}/membership-tiers`, {
    method: 'PATCH',
    body: { tiers },
  });
}
