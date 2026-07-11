'use client';

import { useTipFeed } from '@/hooks/useTipFeed';
import { TipAlertCard } from '@/components/overlay/TipAlertCard';

/**
 * The OBS browser-source root: a transparent, full-viewport surface that
 * shows only the single most recent settled tip as an alert.
 */
export function OverlayFeed({ creatorId }: { creatorId: string }) {
  const tips = useTipFeed(creatorId, 1);
  const latest = tips[0];

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-transparent">
      {latest && <TipAlertCard tip={latest} />}
    </div>
  );
}
