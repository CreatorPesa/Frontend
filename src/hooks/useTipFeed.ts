'use client';

import { useEffect, useRef, useState } from 'react';
import { RealtimeFeed } from '@/lib/realtime/socket';
import type { Tip } from '@/types/tip';
import type { RealtimeEvent } from '@/types/payment';

/**
 * Subscribes to the backend's realtime feed for a creator and accumulates
 * incoming tips — used by both the OBS overlay (most recent tip) and the
 * dashboard (running list).
 */
export function useTipFeed(creatorId: string, maxItems = 20) {
  const [tips, setTips] = useState<Tip[]>([]);
  const feedRef = useRef<RealtimeFeed | null>(null);

  useEffect(() => {
    const feed = new RealtimeFeed(creatorId);
    feedRef.current = feed;
    feed.connect();

    const unsubscribe = feed.subscribe((event: RealtimeEvent) => {
      if (event.type !== 'tip_received') return;
      const tip = event.payload as Tip;
      setTips((prev) => [tip, ...prev].slice(0, maxItems));
    });

    return () => {
      unsubscribe();
      feed.close();
    };
  }, [creatorId, maxItems]);

  return tips;
}
