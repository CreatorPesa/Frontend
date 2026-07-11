import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MembershipTierManager } from '@/components/dashboard/MembershipTierManager';
import { updateMembershipTiers } from '@/lib/api/membership';

vi.mock('@/lib/api/membership', () => ({
  updateMembershipTiers: vi.fn(),
}));

const mockUpdateMembershipTiers = vi.mocked(updateMembershipTiers);

const initialTiers = [{ id: 'tier-1', name: 'Supporter', priceUsdc: 5, perks: ['Shoutout'] }];

describe('MembershipTierManager', () => {
  beforeEach(() => {
    mockUpdateMembershipTiers.mockReset();
  });

  it('renders the initial tier', () => {
    render(<MembershipTierManager creatorId="creator-1" initialTiers={initialTiers} />);
    expect(screen.getByLabelText('Name')).toHaveValue('Supporter');
    expect(screen.getByLabelText('Perks (comma-separated)')).toHaveValue('Shoutout');
  });

  it('adds and removes a tier row', () => {
    render(<MembershipTierManager creatorId="creator-1" initialTiers={initialTiers} />);

    fireEvent.click(screen.getByText('+ Add tier'));
    expect(screen.getAllByLabelText('Name')).toHaveLength(2);

    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[1]!);
    expect(screen.getAllByLabelText('Name')).toHaveLength(1);
  });

  it('blocks saving a tier with no name', () => {
    render(<MembershipTierManager creatorId="creator-1" initialTiers={initialTiers} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save tiers' }));

    expect(screen.getByText('Every tier needs a name.')).toBeInTheDocument();
    expect(mockUpdateMembershipTiers).not.toHaveBeenCalled();
  });

  it('saves valid tiers and adopts the server response', async () => {
    const saved = [{ id: 'tier-1', name: 'Supporter', priceUsdc: 10, perks: ['Shoutout'] }];
    mockUpdateMembershipTiers.mockResolvedValueOnce(saved);

    render(<MembershipTierManager creatorId="creator-1" initialTiers={initialTiers} />);
    fireEvent.change(screen.getByLabelText('Price (USDC/mo)'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save tiers' }));

    await waitFor(() =>
      expect(mockUpdateMembershipTiers).toHaveBeenCalledWith('creator-1', [
        { id: 'tier-1', name: 'Supporter', priceUsdc: 10, perks: ['Shoutout'] },
      ]),
    );
    expect(screen.getByLabelText('Price (USDC/mo)')).toHaveValue(10);
  });

  it('shows a generic error when saving fails', async () => {
    mockUpdateMembershipTiers.mockRejectedValueOnce(new Error('network down'));

    render(<MembershipTierManager creatorId="creator-1" initialTiers={initialTiers} />);
    fireEvent.click(screen.getByRole('button', { name: 'Save tiers' }));

    await waitFor(() =>
      expect(screen.getByText('Failed to save membership tiers. Try again.')).toBeInTheDocument(),
    );
  });
});
