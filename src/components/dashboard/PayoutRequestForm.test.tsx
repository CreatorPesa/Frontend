import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PayoutRequestForm } from '@/components/dashboard/PayoutRequestForm';
import { requestPayout } from '@/lib/api/payouts';
import type { PayoutRequest } from '@/types/payment';

vi.mock('@/lib/api/payouts', () => ({
  requestPayout: vi.fn(),
}));

const mockRequestPayout = vi.mocked(requestPayout);

describe('PayoutRequestForm', () => {
  beforeEach(() => {
    mockRequestPayout.mockReset();
  });

  it('rejects a zero amount without calling the API', () => {
    render(<PayoutRequestForm availableUsdc={100} />);
    fireEvent.click(screen.getByRole('button', { name: 'Request payout' }));

    expect(screen.getByText('Enter an amount greater than zero.')).toBeInTheDocument();
    expect(mockRequestPayout).not.toHaveBeenCalled();
  });

  it('rejects an amount above the available balance', () => {
    render(<PayoutRequestForm availableUsdc={100} />);
    fireEvent.change(screen.getByLabelText('Amount (USDC)'), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: 'Request payout' }));

    expect(screen.getByText('You can withdraw up to 100.00 USDC.')).toBeInTheDocument();
    expect(mockRequestPayout).not.toHaveBeenCalled();
  });

  it('submits a valid amount and notifies the caller on success', async () => {
    const payout: PayoutRequest = {
      id: 'payout-1',
      creatorId: 'creator-1',
      amountUsdc: 50,
      method: 'mobile_money',
      status: 'requested',
      requestedAt: new Date(0).toISOString(),
      completedAt: null,
    };
    mockRequestPayout.mockResolvedValueOnce(payout);
    const onRequested = vi.fn();

    render(<PayoutRequestForm availableUsdc={100} onRequested={onRequested} />);
    fireEvent.change(screen.getByLabelText('Amount (USDC)'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: 'Request payout' }));

    await waitFor(() => expect(onRequested).toHaveBeenCalledWith(payout));
    expect(mockRequestPayout).toHaveBeenCalledWith(50, 'mobile_money');
    expect(screen.getByLabelText('Amount (USDC)')).toHaveValue(null);
  });

  it('shows a generic error when the request fails', async () => {
    mockRequestPayout.mockRejectedValueOnce(new Error('network down'));

    render(<PayoutRequestForm availableUsdc={100} />);
    fireEvent.change(screen.getByLabelText('Amount (USDC)'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: 'Request payout' }));

    await waitFor(() =>
      expect(
        screen.getByText('Something went wrong requesting the payout. Try again.'),
      ).toBeInTheDocument(),
    );
  });
});
