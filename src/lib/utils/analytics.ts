export interface ViewDataPoint {
  date: string;
  views: number;
}

/**
 * Distributes a period's total views across `days` as a deterministic,
 * smoothed curve — used until the analytics endpoint exposes a real daily
 * breakdown. Deliberately not random: the previous version re-rolled
 * Math.random() on every render, so a creator refreshing their dashboard
 * saw their own view chart reshuffle for no reason. This still isn't real
 * data (see the `estimated` label on AnalyticsChart), but it's at least
 * stable across renders of the same totalViews.
 */
export function buildEstimatedViewSeries(totalViews: number, days = 14): ViewDataPoint[] {
  const base = totalViews / days;
  const weights = Array.from(
    { length: days },
    (_, i) => 0.85 + 0.3 * Math.sin((i / days) * Math.PI),
  );
  const weightSum = weights.reduce((sum, w) => sum + w, 0);

  return weights.map((weight, i) => ({
    date: `Day ${i + 1}`,
    views: Math.round((base * days * weight) / weightSum),
  }));
}
