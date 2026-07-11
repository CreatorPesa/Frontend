'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { createSponsorshipDeal } from '@/lib/api/sponsorships';
import { sponsorshipDealSchema } from '@/lib/validation/sponsorship';
import type { SponsorshipDeal } from '@/types/sponsorship';

export function SponsorshipDealForm({
  creatorId,
  onCreated,
}: {
  creatorId: string;
  onCreated: (deal: SponsorshipDeal) => void;
}) {
  const [brandName, setBrandName] = useState('');
  const [amount, setAmount] = useState('');
  const [deliverableSpec, setDeliverableSpec] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const result = sponsorshipDealSchema.safeParse({
      brandName,
      amountUsdc: Number(amount),
      deliverableSpec,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check the deal details and try again.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const deal = await createSponsorshipDeal(creatorId, result.data);
      onCreated(deal);
      setBrandName('');
      setAmount('');
      setDeliverableSpec('');
    } catch {
      setError('Something went wrong proposing this deal. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propose a new deal</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <p className="text-sm text-ink-500">
          Record the terms here once you and the brand agree — the brand funds the escrow contract
          next, and nothing is paid out until your deliverable is attested and the dispute window
          passes.
        </p>

        <Input
          label="Brand name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <Input
          label="Amount (USDC)"
          type="number"
          min={0}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="deliverable-spec" className="text-sm font-medium text-ink-700">
            Deliverable
          </label>
          <textarea
            id="deliverable-spec"
            rows={3}
            value={deliverableSpec}
            onChange={(e) => setDeliverableSpec(e.target.value)}
            placeholder="e.g. one 60-second integration in my next upload, with a tracking link in the description"
            className="rounded-lg border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button onClick={handleSubmit} isLoading={submitting} className="self-start">
          Propose deal
        </Button>
      </CardBody>
    </Card>
  );
}
