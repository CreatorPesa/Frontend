'use client';

import { useState } from 'react';
import { SponsorshipCard } from '@/components/dashboard/SponsorshipCard';
import { SponsorshipDealForm } from '@/components/dashboard/SponsorshipDealForm';
import type { SponsorshipDeal } from '@/types/sponsorship';

export function SponsorshipsList({
  creatorId,
  initialDeals,
}: {
  creatorId: string;
  initialDeals: SponsorshipDeal[];
}) {
  const [deals, setDeals] = useState(initialDeals);

  return (
    <div className="flex flex-col gap-6">
      <SponsorshipDealForm
        creatorId={creatorId}
        onCreated={(deal) => setDeals((prev) => [deal, ...prev])}
      />

      <div className="flex flex-col gap-3">
        {deals.length === 0 && <p className="text-sm text-ink-500">No sponsorship deals yet.</p>}
        {deals.map((deal) => (
          <SponsorshipCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
