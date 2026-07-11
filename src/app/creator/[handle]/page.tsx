import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CreatorHeader } from '@/components/tipping/CreatorHeader';
import { TipForm } from '@/components/tipping/TipForm';
import { QRCodePanel } from '@/components/tipping/QRCodePanel';
import { MembershipTierCard } from '@/components/tipping/MembershipTierCard';
import { Card, CardBody } from '@/components/ui/Card';
import { ApiError } from '@/lib/api/client';
import { getCreatorByHandle } from '@/lib/api/creators';

export default async function CreatorTipPage({ params }: { params: { handle: string } }) {
  const creator = await getCreatorByHandle(params.handle).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });

  if (!creator) {
    notFound();
  }

  const pageUrl = `https://creatorpesa.app/@${creator.handle}`;

  return (
    <div className="min-h-screen bg-ink-50 py-12">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4">
        <Link href="/" className="text-center text-sm font-medium text-ink-500">
          CreatorPesa
        </Link>

        <CreatorHeader creator={creator} />

        {creator.crowdfundingGoal && (
          <Card>
            <CardBody>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-ink-800">{creator.crowdfundingGoal.title}</span>
                <span className="text-ink-500">
                  ${creator.crowdfundingGoal.raisedUsdc.toFixed(0)} / $
                  {creator.crowdfundingGoal.targetUsdc.toFixed(0)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (creator.crowdfundingGoal.raisedUsdc / creator.crowdfundingGoal.targetUsdc) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardBody>
            <TipForm creatorHandle={creator.handle} />
          </CardBody>
        </Card>

        <QRCodePanel url={pageUrl} />

        {creator.membershipTiers && creator.membershipTiers.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ink-700">Membership tiers</h2>
            {creator.membershipTiers.map((tier) => (
              <MembershipTierCard key={tier.id} tier={tier} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
