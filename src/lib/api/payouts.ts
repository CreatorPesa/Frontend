import { apiFetch } from '@/lib/api/client';
import type { PayoutRequest } from '@/types/payment';

export function requestPayout(amountUsdc: number, method: PayoutRequest['method']) {
  return apiFetch<PayoutRequest>('/payouts', { method: 'POST', body: { amountUsdc, method } });
}

export function getPayoutHistory(creatorId: string, cookie?: string) {
  return apiFetch<PayoutRequest[]>(`/creators/${creatorId}/payouts`, { cookie });
}
