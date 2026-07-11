'use client';

import { Button } from '@/components/ui/Button';

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-ink-100 bg-white p-10 text-center shadow-card">
      <p className="text-lg font-semibold text-ink-900">{title}</p>
      <p className="max-w-sm text-sm text-ink-500">{message}</p>
      <Button onClick={onRetry} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
