import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnalyticsChart } from './AnalyticsChart';

const data = [
  { date: 'Day 1', views: 100 },
  { date: 'Day 2', views: 120 },
];

describe('AnalyticsChart', () => {
  it('shows an Estimated badge when estimated is true', () => {
    render(<AnalyticsChart data={data} estimated />);
    expect(screen.getByText('Estimated')).toBeInTheDocument();
  });

  it('omits the badge by default', () => {
    render(<AnalyticsChart data={data} />);
    expect(screen.queryByText('Estimated')).not.toBeInTheDocument();
  });
});
