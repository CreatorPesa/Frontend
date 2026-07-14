import { describe, expect, it } from 'vitest';
import { buildEstimatedViewSeries } from './analytics';

describe('buildEstimatedViewSeries', () => {
  it('returns one point per day', () => {
    expect(buildEstimatedViewSeries(1400, 14)).toHaveLength(14);
  });

  it('is deterministic for the same input', () => {
    const first = buildEstimatedViewSeries(1400, 14);
    const second = buildEstimatedViewSeries(1400, 14);
    expect(second).toEqual(first);
  });

  it('sums to roughly the total views', () => {
    const series = buildEstimatedViewSeries(1400, 14);
    const total = series.reduce((sum, point) => sum + point.views, 0);
    expect(total).toBeGreaterThan(1300);
    expect(total).toBeLessThan(1500);
  });
});
