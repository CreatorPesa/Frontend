import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveRecentTips } from '@/components/dashboard/LiveRecentTips';
import { useTipFeed } from '@/hooks/useTipFeed';
import type { Tip } from '@/types/tip';

vi.mock('@/hooks/useTipFeed', () => ({
  useTipFeed: vi.fn(),
}));

const mockUseTipFeed = vi.mocked(useTipFeed);

function makeTip(id: string, fromName: string): Tip {
  return {
    id,
    creatorId: 'creator-1',
    fromName,
    message: null,
    amountUsdc: 5,
    method: 'mpesa',
    status: 'settled',
    txHash: null,
    createdAt: new Date(0).toISOString(),
  };
}

describe('LiveRecentTips', () => {
  it('renders the server-rendered snapshot when no live tips have arrived', () => {
    mockUseTipFeed.mockReturnValue([]);
    render(<LiveRecentTips creatorId="creator-1" initialTips={[makeTip('1', 'Alice')]} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('prepends new live tips ahead of the initial snapshot', () => {
    mockUseTipFeed.mockReturnValue([makeTip('2', 'Bob')]);
    render(<LiveRecentTips creatorId="creator-1" initialTips={[makeTip('1', 'Alice')]} />);

    const names = screen.getAllByRole('row').map((row) => row.textContent);
    // header row, then Bob (live) before Alice (initial snapshot)
    expect(names[1]).toContain('Bob');
    expect(names[2]).toContain('Alice');
  });

  it('dedupes a tip that arrives live after already being in the snapshot', () => {
    mockUseTipFeed.mockReturnValue([makeTip('1', 'Alice')]);
    render(<LiveRecentTips creatorId="creator-1" initialTips={[makeTip('1', 'Alice')]} />);

    expect(screen.getAllByText('Alice')).toHaveLength(1);
  });
});
