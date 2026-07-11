import { formatUsdc } from '@/lib/utils/currency';
import type { Tip } from '@/types/tip';

/**
 * Rendered inside the OBS browser source — kept high-contrast and free of
 * app chrome since it's composited directly over a live video stream.
 */
export function TipAlertCard({ tip }: { tip: Tip }) {
  return (
    <div className="flex animate-[slide-in_0.4s_ease-out] items-center gap-4 rounded-2xl bg-ink-950/90 px-6 py-4 text-white shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-xl font-bold">
        {formatUsdc(tip.amountUsdc).replace('.00', '')}
      </div>
      <div>
        <p className="text-lg font-semibold">{tip.fromName ?? 'Anonymous'} tipped!</p>
        {tip.message && <p className="text-sm text-ink-200">{tip.message}</p>}
      </div>
    </div>
  );
}
