import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatUsdc } from '@/lib/utils/currency';
import type { CreatorEarningsSummary } from '@/types/creator';

export function EarningsSummaryCard({ earnings }: { earnings: CreatorEarningsSummary }) {
  const items = [
    { label: 'Tips', value: earnings.totalTipsUsdc },
    { label: 'Sponsorships', value: earnings.totalSponsorshipsUsdc },
    { label: 'Pending payout', value: earnings.pendingPayoutUsdc },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings</CardTitle>
      </CardHeader>
      <CardBody className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-ink-500">{item.label}</p>
            <p className="mt-1 text-xl font-semibold text-ink-900">{formatUsdc(item.value)}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
