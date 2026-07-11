import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TipForm } from '@/components/tipping/TipForm';
import { createTip } from '@/lib/api/tips';

vi.mock('@/lib/api/tips', () => ({
  createTip: vi.fn(),
}));

const mockCreateTip = vi.mocked(createTip);

describe('TipForm', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    mockCreateTip.mockReset();
    // jsdom doesn't implement real navigation, so stub `location` to observe
    // the redirect to the anchor's deposit flow without it throwing.
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('requires a payment method before submitting', () => {
    render(<TipForm creatorHandle="janedoe" />);
    fireEvent.click(screen.getByRole('button', { name: /Send \$5\.00 tip/ }));

    expect(screen.getByText('Choose a payment method.')).toBeInTheDocument();
    expect(mockCreateTip).not.toHaveBeenCalled();
  });

  it('requires a positive amount before submitting', () => {
    render(<TipForm creatorHandle="janedoe" />);
    fireEvent.change(screen.getByPlaceholderText('Custom amount'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'M-Pesa' }));
    fireEvent.click(screen.getByRole('button', { name: /Send tip/ }));

    expect(screen.getByText('Choose an amount to tip.')).toBeInTheDocument();
    expect(mockCreateTip).not.toHaveBeenCalled();
  });

  it('submits a valid tip and redirects to the deposit URL', async () => {
    mockCreateTip.mockResolvedValueOnce({
      tipId: 'tip-1',
      depositUrl: 'https://anchor.example/deposit/tip-1',
    });

    render(<TipForm creatorHandle="janedoe" />);
    fireEvent.click(screen.getByRole('button', { name: 'M-Pesa' }));
    fireEvent.click(screen.getByRole('button', { name: /Send \$5\.00 tip/ }));

    await waitFor(() => expect(window.location.href).toBe('https://anchor.example/deposit/tip-1'));
    expect(mockCreateTip).toHaveBeenCalledWith({
      creatorHandle: 'janedoe',
      amountUsdc: 5,
      method: 'mpesa',
      fromName: undefined,
      message: undefined,
    });
  });

  it('shows a generic error when the API call fails', async () => {
    mockCreateTip.mockRejectedValueOnce(new Error('network down'));

    render(<TipForm creatorHandle="janedoe" />);
    fireEvent.click(screen.getByRole('button', { name: 'M-Pesa' }));
    fireEvent.click(screen.getByRole('button', { name: /Send \$5\.00 tip/ }));

    await waitFor(() =>
      expect(
        screen.getByText('Something went wrong starting your tip. Please try again.'),
      ).toBeInTheDocument(),
    );
  });
});
