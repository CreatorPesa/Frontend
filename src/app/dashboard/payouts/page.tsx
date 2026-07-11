import { cookies } from 'next/headers';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PayoutRequestForm } from '@/components/dashboard/PayoutRequestForm';
import { getCreatorEarnings, getMyCreatorProfile } from '@/lib/api/creators';
import { getPayoutHistory } from '@/lib/api/payouts';
import { formatUsdc } from '@/lib/utils/currency';
import type { PayoutStatus } from '@/types/payment';

const statusTone: Record<PayoutStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  requested: 'neutral',
  processing: 'warning',
  completed: 'success',
  failed: 'danger',
};

export default async function PayoutsPage() {
  const cookieHeader = cookies().toString();
  const creator = await getMyCreatorProfile(cookieHeader);
  const [earnings, history] = await Promise.all([
    getCreatorEarnings(creator.id, cookieHeader),
    getPayoutHistory(creator.id, cookieHeader),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-ink-900">Payouts</h1>

      <PayoutRequestForm availableUsdc={earnings.pendingPayoutUsdc} />

      <Card>
        <CardHeader>
          <CardTitle>Payout history</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          {history.length === 0 && <p className="text-sm text-ink-500">No payouts yet.</p>}
          {history.map((payout) => (
            <div
              key={payout.id}
              className="flex items-center justify-between border-b border-ink-50 pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-ink-800">{formatUsdc(payout.amountUsdc)}</p>
                <p className="text-xs text-ink-500">{payout.method.replace('_', ' ')}</p>
              </div>
              <Badge tone={statusTone[payout.status]}>{payout.status}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
