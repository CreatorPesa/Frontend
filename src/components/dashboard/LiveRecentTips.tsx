'use client';

import { useMemo } from 'react';
import { RecentTipsTable } from '@/components/dashboard/RecentTipsTable';
import { useTipFeed } from '@/hooks/useTipFeed';
import type { Tip } from '@/types/tip';

const MAX_TIPS = 20;

/**
 * Merges the server-rendered snapshot with the realtime feed so new tips
 * appear the instant they settle, without waiting on a full page refresh.
 * Live tips take priority; duplicates (a tip that arrives over the socket
 * moments after the server already rendered it) are deduped by id.
 */
export function LiveRecentTips({
  creatorId,
  initialTips,
}: {
  creatorId: string;
  initialTips: Tip[];
}) {
  const liveTips = useTipFeed(creatorId, MAX_TIPS);

  const tips = useMemo(() => {
    const seen = new Set<string>();
    const merged: Tip[] = [];
    for (const tip of [...liveTips, ...initialTips]) {
      if (seen.has(tip.id)) continue;
      seen.add(tip.id);
      merged.push(tip);
    }
    return merged.slice(0, MAX_TIPS);
  }, [liveTips, initialTips]);

  return <RecentTipsTable tips={tips} />;
}
