import { cookies } from 'next/headers';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/dashboard/VerifiedBadge';
import { WalletConnectCard } from '@/components/dashboard/WalletConnectCard';
import { MembershipTierManager } from '@/components/dashboard/MembershipTierManager';
import { getMyCreatorProfile } from '@/lib/api/creators';
import { truncateAddress } from '@/lib/stellar/format';
import { buildSignedOverlayUrl } from '@/lib/auth/overlayUrl';
import { serverEnv } from '@/lib/env.server';

export default async function SettingsPage() {
  const cookieHeader = cookies().toString();
  const creator = await getMyCreatorProfile(cookieHeader);
  const overlayUrl = await buildSignedOverlayUrl(
    'https://creatorpesa.app',
    creator.id,
    serverEnv.OVERLAY_SIGNING_SECRET,
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-ink-900">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Channel</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Handle</span>
            <span className="font-medium text-ink-800">@{creator.handle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Verification</span>
            <VerifiedBadge isVerified={creator.isVerified} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Stellar address</span>
            <span className="font-mono text-xs text-ink-800">
              {truncateAddress(creator.stellarAddress)}
            </span>
          </div>
        </CardBody>
      </Card>

      <WalletConnectCard />

      <MembershipTierManager creatorId={creator.id} initialTiers={creator.membershipTiers} />

      <Card>
        <CardHeader>
          <CardTitle>OBS overlay</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          <p className="text-ink-500">
            Add this URL as a Browser Source in OBS to show live tip alerts on stream.
          </p>
          <code className="break-all rounded-md bg-ink-50 p-2 text-xs text-ink-800">
            {overlayUrl}
          </code>
        </CardBody>
      </Card>
    </div>
  );
}
