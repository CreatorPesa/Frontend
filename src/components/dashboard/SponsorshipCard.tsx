import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { formatUsdc } from '@/lib/utils/currency';
import type { EscrowStatus, SponsorshipDeal } from '@/types/sponsorship';

const statusTone: Record<EscrowStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  proposed: 'neutral',
  funded: 'neutral',
  delivery_attested: 'warning',
  dispute_window: 'warning',
  disputed: 'danger',
  released: 'success',
  refunded: 'danger',
};

const statusLabel: Record<EscrowStatus, string> = {
  proposed: 'Awaiting brand funding',
  funded: 'Funded',
  delivery_attested: 'Delivery attested',
  dispute_window: 'Dispute window open',
  disputed: 'Disputed',
  released: 'Released',
  refunded: 'Refunded',
};

export function SponsorshipCard({ deal }: { deal: SponsorshipDeal }) {
  return (
    <Card>
      <CardBody className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-ink-900">{deal.brandName}</p>
          <p className="mt-0.5 text-sm text-ink-500">{deal.deliverableSpec}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-semibold text-ink-900">{formatUsdc(deal.amountUsdc)}</span>
          <Badge tone={statusTone[deal.status]}>{statusLabel[deal.status]}</Badge>
        </div>
      </CardBody>
    </Card>
  );
}
