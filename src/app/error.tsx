'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';

export default function HomeError({
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <ErrorState
        title="CreatorPesa is having trouble loading"
        message="Something went wrong on our end. Please try again in a moment."
        onRetry={reset}
      />
    </div>
  );
}
