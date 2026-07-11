'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { requestPayout } from '@/lib/api/payouts';
import { payoutFormSchema } from '@/lib/validation/payout';
import type { PayoutRequest } from '@/types/payment';

export function PayoutRequestForm({
  availableUsdc,
  onRequested,
}: {
  availableUsdc: number;
  onRequested?: (payout: PayoutRequest) => void;
}) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PayoutRequest['method']>('mobile_money');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const result = payoutFormSchema(availableUsdc).safeParse({
      amountUsdc: Number(amount),
      method,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check the form and try again.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payout = await requestPayout(result.data.amountUsdc, result.data.method);
      onRequested?.(payout);
      setAmount('');
    } catch {
      setError('Something went wrong requesting the payout. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash out</CardTitle>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="payout-amount"
            label="Amount (USDC)"
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={error ?? undefined}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="payout-method" className="text-sm font-medium text-ink-700">
              Payout method
            </label>
            <select
              id="payout-method"
              value={method}
              onChange={(e) => setMethod(e.target.value as PayoutRequest['method'])}
              className="h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="mobile_money">Mobile money</option>
              <option value="bank_transfer">Bank transfer</option>
            </select>
          </div>

          <Button type="submit" isLoading={submitting}>
            Request payout
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
