import { apiFetch } from '@/lib/api/client';
import type { RevenueSplitConfig, RevenueSplitRecipient } from '@/types/split';

export function getSplitConfig(creatorId: string, cookie?: string) {
  return apiFetch<RevenueSplitConfig>(`/creators/${creatorId}/splits`, { cookie });
}

export function updateSplitConfig(creatorId: string, recipients: RevenueSplitRecipient[]) {
  return apiFetch<RevenueSplitConfig>(`/creators/${creatorId}/splits`, {
    method: 'PATCH',
    body: { recipients },
  });
}
