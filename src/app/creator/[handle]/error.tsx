'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';

export default function CreatorPageError({
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
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <ErrorState
        title="This page couldn't load"
        message="We had trouble loading this creator's page. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
