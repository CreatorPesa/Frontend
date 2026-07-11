import { env } from '@/lib/env';
import type { RealtimeEvent } from '@/types/payment';

type Listener = (event: RealtimeEvent) => void;

/**
 * Thin wrapper around a native WebSocket connected to the backend's chain
 * indexer feed. Reconnects with backoff so a dropped connection during a
 * live stream self-heals without the OBS overlay needing a manual refresh.
 */
export class RealtimeFeed {
  private socket: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private reconnectAttempt = 0;
  private closedByCaller = false;

  constructor(private readonly creatorId: string) {}

  connect() {
    this.closedByCaller = false;
    const url = `${env.NEXT_PUBLIC_WS_URL}?creatorId=${encodeURIComponent(this.creatorId)}`;
    this.socket = new WebSocket(url);

    this.socket.addEventListener('message', (evt) => {
      try {
        const parsed = JSON.parse(evt.data) as RealtimeEvent;
        this.listeners.forEach((listener) => listener(parsed));
      } catch {
        // Ignore malformed frames rather than crashing the overlay mid-stream.
      }
    });

    this.socket.addEventListener('close', () => {
      if (this.closedByCaller) return;
      const delay = Math.min(1000 * 2 ** this.reconnectAttempt, 15000);
      this.reconnectAttempt += 1;
      setTimeout(() => this.connect(), delay);
    });

    this.socket.addEventListener('open', () => {
      this.reconnectAttempt = 0;
    });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  close() {
    this.closedByCaller = true;
    this.socket?.close();
  }
}
