import { apiFetch } from '@/lib/api/client';
import type { CreateTipRequest, CreateTipResponse, Tip } from '@/types/tip';

export function createTip(request: CreateTipRequest) {
  return apiFetch<CreateTipResponse>('/tips', { method: 'POST', body: request });
}

export function getRecentTips(creatorId: string, cookie?: string) {
  return apiFetch<Tip[]>(`/creators/${creatorId}/tips?limit=25`, { cookie });
}
