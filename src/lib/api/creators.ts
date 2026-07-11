import { apiFetch } from '@/lib/api/client';
import type {
  CreatorAnalyticsSummary,
  CreatorEarningsSummary,
  CreatorProfile,
} from '@/types/creator';

export function getCreatorByHandle(handle: string) {
  return apiFetch<CreatorProfile>(`/creators/${handle}`);
}

export function getMyCreatorProfile(cookie?: string) {
  return apiFetch<CreatorProfile>('/creators/me', { cookie });
}

export function getCreatorAnalytics(creatorId: string, cookie?: string) {
  return apiFetch<CreatorAnalyticsSummary>(`/creators/${creatorId}/analytics`, { cookie });
}

export function getCreatorEarnings(creatorId: string, cookie?: string) {
  return apiFetch<CreatorEarningsSummary>(`/creators/${creatorId}/earnings`, { cookie });
}
