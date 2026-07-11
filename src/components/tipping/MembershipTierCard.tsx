import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import type { MembershipTier } from '@/types/creator';

export function MembershipTierCard({ tier }: { tier: MembershipTier }) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h3 className="font-semibold text-ink-900">{tier.name}</h3>
          <span className="text-sm font-medium text-ink-500">${tier.priceUsdc}/mo</span>
        </div>
        <ul className="flex flex-col gap-1 text-sm text-ink-600">
          {tier.perks.map((perk) => (
            <li key={perk}>• {perk}</li>
          ))}
        </ul>
        <Button variant="secondary" size="sm" className="self-start">
          Join
        </Button>
      </CardBody>
    </Card>
  );
}
