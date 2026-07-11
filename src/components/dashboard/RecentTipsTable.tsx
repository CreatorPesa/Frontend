import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatUsdc } from '@/lib/utils/currency';
import type { Tip, TipStatus } from '@/types/tip';

const statusTone: Record<TipStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  initiated: 'neutral',
  converted: 'warning',
  settled: 'success',
  failed: 'danger',
};

export function RecentTipsTable({ tips }: { tips: Tip[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent tips</CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        {tips.length === 0 ? (
          <p className="p-5 text-sm text-ink-500">
            No tips yet — share your public page to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs text-ink-500">
                <th className="px-5 py-2 font-medium">From</th>
                <th className="px-5 py-2 font-medium">Message</th>
                <th className="px-5 py-2 font-medium">Amount</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((tip) => (
                <tr key={tip.id} className="border-b border-ink-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-800">
                    {tip.fromName ?? 'Anonymous'}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3 text-ink-500">{tip.message ?? '—'}</td>
                  <td className="px-5 py-3 text-ink-800">{formatUsdc(tip.amountUsdc)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone[tip.status]}>{tip.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
}
