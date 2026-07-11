'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { updateSplitConfig } from '@/lib/api/splits';
import { bpsToPercent } from '@/lib/utils/currency';
import { splitConfigSchema } from '@/lib/validation/split';
import type { RevenueSplitRecipient } from '@/types/split';

export function SplitConfigForm({
  creatorId,
  initialRecipients,
}: {
  creatorId: string;
  initialRecipients: RevenueSplitRecipient[];
}) {
  const [recipients, setRecipients] = useState(initialRecipients);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalBps = recipients.reduce((sum, r) => sum + r.bps, 0);

  function updateRecipient(index: number, patch: Partial<RevenueSplitRecipient>) {
    setRecipients((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRecipient() {
    setRecipients((prev) => [...prev, { label: '', stellarAddress: '', bps: 0 }]);
  }

  async function handleSave() {
    const result = splitConfigSchema.safeParse({ recipients });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check the splits and try again.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateSplitConfig(creatorId, recipients);
    } catch {
      setError('Failed to save splits. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue splits</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <p className="text-sm text-ink-500">
          Splits apply to future tips and sponsorship payouts, distributed atomically on-chain by
          the Payment Splitter contract.
        </p>

        {recipients.map((recipient, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
            <Input
              label="Label"
              value={recipient.label}
              onChange={(e) => updateRecipient(index, { label: e.target.value })}
            />
            <Input
              label="Stellar address"
              value={recipient.stellarAddress}
              onChange={(e) => updateRecipient(index, { stellarAddress: e.target.value })}
            />
            <Input
              label="Share (bps)"
              type="number"
              value={recipient.bps}
              onChange={(e) => updateRecipient(index, { bps: Number(e.target.value) })}
            />
          </div>
        ))}

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={addRecipient}
            className="font-medium text-brand-700 hover:underline"
          >
            + Add recipient
          </button>
          <span className={totalBps === 10000 ? 'text-ink-500' : 'text-red-600'}>
            Total: {bpsToPercent(totalBps)}
          </span>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button onClick={handleSave} isLoading={saving} className="self-start">
          Save splits
        </Button>
      </CardBody>
    </Card>
  );
}
