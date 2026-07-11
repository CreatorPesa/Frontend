'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <ErrorState
        title="We couldn't load your dashboard"
        message="There was a problem reaching CreatorPesa's servers. Your session is fine — just try again."
        onRetry={reset}
      />
    </div>
  );
}
