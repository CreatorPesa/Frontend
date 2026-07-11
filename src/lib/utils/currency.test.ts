import { describe, expect, it } from 'vitest';
import { bpsToPercent, formatUsdc } from '@/lib/utils/currency';

describe('formatUsdc', () => {
  it('formats a number as USD currency', () => {
    expect(formatUsdc(7.5)).toBe('$7.50');
  });
});

describe('bpsToPercent', () => {
  it('converts basis points to a percentage string', () => {
    expect(bpsToPercent(7500)).toBe('75.00%');
    expect(bpsToPercent(10000)).toBe('100.00%');
  });
});
