import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SponsorshipDealForm } from '@/components/dashboard/SponsorshipDealForm';
import { createSponsorshipDeal } from '@/lib/api/sponsorships';
import type { SponsorshipDeal } from '@/types/sponsorship';

vi.mock('@/lib/api/sponsorships', () => ({
  createSponsorshipDeal: vi.fn(),
}));

const mockCreateSponsorshipDeal = vi.mocked(createSponsorshipDeal);

describe('SponsorshipDealForm', () => {
  beforeEach(() => {
    mockCreateSponsorshipDeal.mockReset();
  });

  it('requires a brand name before submitting', () => {
    render(<SponsorshipDealForm creatorId="creator-1" onCreated={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Propose deal' }));

    expect(screen.getByText('Enter the brand name.')).toBeInTheDocument();
    expect(mockCreateSponsorshipDeal).not.toHaveBeenCalled();
  });

  it('submits valid deal terms and notifies the caller', async () => {
    const deal: SponsorshipDeal = {
      id: 'deal-1',
      creatorId: 'creator-1',
      brandName: 'Acme',
      amountUsdc: 200,
      deliverableSpec: 'One integration',
      deliverableUrl: null,
      status: 'proposed',
      disputeWindowHours: 72,
      disputeWindowEndsAt: null,
      createdAt: new Date(0).toISOString(),
    };
    mockCreateSponsorshipDeal.mockResolvedValueOnce(deal);
    const onCreated = vi.fn();

    render(<SponsorshipDealForm creatorId="creator-1" onCreated={onCreated} />);
    fireEvent.change(screen.getByLabelText('Brand name'), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByLabelText('Amount (USDC)'), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText('Deliverable'), {
      target: { value: 'One integration' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Propose deal' }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(deal));
    expect(mockCreateSponsorshipDeal).toHaveBeenCalledWith('creator-1', {
      brandName: 'Acme',
      amountUsdc: 200,
      deliverableSpec: 'One integration',
    });
  });

  it('shows a generic error when the request fails', async () => {
    mockCreateSponsorshipDeal.mockRejectedValueOnce(new Error('network down'));

    render(<SponsorshipDealForm creatorId="creator-1" onCreated={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Brand name'), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByLabelText('Amount (USDC)'), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText('Deliverable'), {
      target: { value: 'One integration' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Propose deal' }));

    await waitFor(() =>
      expect(
        screen.getByText('Something went wrong proposing this deal. Try again.'),
      ).toBeInTheDocument(),
    );
  });
});
