import { cookies } from 'next/headers';
import { SponsorshipsList } from '@/components/dashboard/SponsorshipsList';
import { getMyCreatorProfile } from '@/lib/api/creators';
import { getSponsorshipDeals } from '@/lib/api/sponsorships';

export default async function SponsorshipsPage() {
  const cookieHeader = cookies().toString();
  const creator = await getMyCreatorProfile(cookieHeader);
  const deals = await getSponsorshipDeals(creator.id, cookieHeader);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Sponsorships</h1>
        <p className="text-sm text-ink-500">
          Funds are held in escrow until your deliverable is attested and the dispute window passes.
        </p>
      </div>

      <SponsorshipsList creatorId={creator.id} initialDeals={deals} />
    </div>
  );
}
