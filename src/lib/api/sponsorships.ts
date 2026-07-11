import { apiFetch } from '@/lib/api/client';
import type { CreateSponsorshipDealRequest, SponsorshipDeal } from '@/types/sponsorship';

export function getSponsorshipDeals(creatorId: string, cookie?: string) {
  return apiFetch<SponsorshipDeal[]>(`/creators/${creatorId}/sponsorships`, { cookie });
}

export function createSponsorshipDeal(creatorId: string, request: CreateSponsorshipDealRequest) {
  return apiFetch<SponsorshipDeal>(`/creators/${creatorId}/sponsorships`, {
    method: 'POST',
    body: request,
  });
}

export function attestDelivery(dealId: string, deliverableUrl: string) {
  return apiFetch<SponsorshipDeal>(`/sponsorships/${dealId}/attest`, {
    method: 'POST',
    body: { deliverableUrl },
  });
}
