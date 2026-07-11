'use client';

import { cn } from '@/lib/utils/cn';
import type { TipPaymentMethod } from '@/types/tip';

const methods: { id: TipPaymentMethod; label: string }[] = [
  { id: 'mpesa', label: 'M-Pesa' },
  { id: 'airtel_money', label: 'Airtel Money' },
  { id: 'mtn_momo', label: 'MTN MoMo' },
  { id: 'bank_transfer', label: 'Bank transfer' },
  { id: 'crypto_wallet', label: 'Crypto wallet' },
];

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: TipPaymentMethod | null;
  onChange: (method: TipPaymentMethod) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-700">Pay with</span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={cn(
              'rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors',
              value === method.id
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-ink-200 text-ink-700 hover:border-ink-300',
            )}
          >
            {method.label}
          </button>
        ))}
      </div>
    </div>
  );
}
