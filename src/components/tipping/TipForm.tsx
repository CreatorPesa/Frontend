'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AmountPicker } from '@/components/tipping/AmountPicker';
import { PaymentMethodSelector } from '@/components/tipping/PaymentMethodSelector';
import { createTip } from '@/lib/api/tips';
import { tipFormSchema } from '@/lib/validation/tip';
import type { TipPaymentMethod } from '@/types/tip';

export function TipForm({ creatorHandle }: { creatorHandle: string }) {
  const [amount, setAmount] = useState<number | null>(5);
  const [method, setMethod] = useState<TipPaymentMethod | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const result = tipFormSchema.safeParse({ amount, method });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check the form and try again.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const { depositUrl } = await createTip({
        creatorHandle,
        amountUsdc: result.data.amount,
        method: result.data.method,
        fromName: name || undefined,
        message: message || undefined,
      });
      window.location.href = depositUrl;
    } catch {
      setError('Something went wrong starting your tip. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <AmountPicker amount={amount} onChange={setAmount} />
      <PaymentMethodSelector value={method} onChange={setMethod} />
      <Input
        label="Your name (optional)"
        placeholder="Anonymous"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tip-message" className="text-sm font-medium text-ink-700">
          Message (optional)
        </label>
        <textarea
          id="tip-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-lg border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="Say something nice!"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button size="lg" onClick={handleSubmit} isLoading={submitting}>
        Send {amount ? `$${amount.toFixed(2)}` : ''} tip
      </Button>
    </div>
  );
}
