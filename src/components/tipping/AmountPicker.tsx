'use client';

import { cn } from '@/lib/utils/cn';

const presetAmounts = [1, 5, 10, 25];

export function AmountPicker({
  amount,
  onChange,
}: {
  amount: number | null;
  onChange: (amount: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={cn(
              'rounded-lg border py-2 text-sm font-medium transition-colors',
              amount === preset
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-ink-200 text-ink-700 hover:border-ink-300',
            )}
          >
            ${preset}
          </button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
        <input
          type="number"
          min={0.5}
          step="0.5"
          placeholder="Custom amount"
          value={amount ?? ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 w-full rounded-lg border border-ink-200 pl-7 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>
    </div>
  );
}
