import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SplitConfigForm } from '@/components/dashboard/SplitConfigForm';
import { updateSplitConfig } from '@/lib/api/splits';

vi.mock('@/lib/api/splits', () => ({
  updateSplitConfig: vi.fn(),
}));

const mockUpdateSplitConfig = vi.mocked(updateSplitConfig);

const singleRecipient = [{ label: 'Creator', stellarAddress: 'GABC123', bps: 10000 }];

describe('SplitConfigForm', () => {
  beforeEach(() => {
    mockUpdateSplitConfig.mockReset();
  });

  it('renders the initial recipient and a valid 100% total', () => {
    render(<SplitConfigForm creatorId="creator-1" initialRecipients={singleRecipient} />);

    expect(screen.getAllByLabelText('Label')[0]).toHaveValue('Creator');
    expect(screen.getByText('Total: 100.00%')).toBeInTheDocument();
  });

  it('adds a new recipient row', () => {
    render(<SplitConfigForm creatorId="creator-1" initialRecipients={singleRecipient} />);

    fireEvent.click(screen.getByText('+ Add recipient'));

    expect(screen.getAllByLabelText('Label')).toHaveLength(2);
  });

  it('blocks saving when splits do not add up to 100%', () => {
    render(<SplitConfigForm creatorId="creator-1" initialRecipients={singleRecipient} />);

    fireEvent.change(screen.getByLabelText('Share (bps)'), { target: { value: '5000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save splits' }));

    expect(screen.getByText('Splits must add up to exactly 100%.')).toBeInTheDocument();
    expect(mockUpdateSplitConfig).not.toHaveBeenCalled();
  });

  it('saves when splits add up to exactly 100%', async () => {
    mockUpdateSplitConfig.mockResolvedValueOnce({
      creatorId: 'creator-1',
      recipients: singleRecipient,
      totalBps: 10000,
      updatedAt: new Date(0).toISOString(),
    });

    render(<SplitConfigForm creatorId="creator-1" initialRecipients={singleRecipient} />);
    fireEvent.click(screen.getByRole('button', { name: 'Save splits' }));

    await waitFor(() =>
      expect(mockUpdateSplitConfig).toHaveBeenCalledWith('creator-1', singleRecipient),
    );
    expect(screen.queryByText('Splits must add up to exactly 100%.')).not.toBeInTheDocument();
  });

  it('shows a generic error when saving fails', async () => {
    mockUpdateSplitConfig.mockRejectedValueOnce(new Error('network down'));

    render(<SplitConfigForm creatorId="creator-1" initialRecipients={singleRecipient} />);
    fireEvent.click(screen.getByRole('button', { name: 'Save splits' }));

    await waitFor(() =>
      expect(screen.getByText('Failed to save splits. Try again.')).toBeInTheDocument(),
    );
  });
});
