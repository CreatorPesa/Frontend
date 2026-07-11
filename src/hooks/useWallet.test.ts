import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWallet } from '@/hooks/useWallet';
import { connectWallet, WalletError } from '@/lib/stellar/freighter';

vi.mock('@/lib/stellar/freighter', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/stellar/freighter')>();
  return {
    ...actual,
    connectWallet: vi.fn(),
  };
});

const mockConnectWallet = vi.mocked(connectWallet);

describe('useWallet', () => {
  beforeEach(() => {
    mockConnectWallet.mockReset();
  });

  it('starts disconnected', () => {
    const { result } = renderHook(() => useWallet());
    expect(result.current.address).toBeNull();
    expect(result.current.connecting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets the address on a successful connect', async () => {
    mockConnectWallet.mockResolvedValueOnce('GABC123');
    const { result } = renderHook(() => useWallet());

    act(() => {
      void result.current.connect();
    });

    await waitFor(() => expect(result.current.address).toBe('GABC123'));
    expect(result.current.connecting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('surfaces a WalletError message on a failed connect', async () => {
    mockConnectWallet.mockRejectedValueOnce(new WalletError('User declined access'));
    const { result } = renderHook(() => useWallet());

    act(() => {
      void result.current.connect();
    });

    await waitFor(() => expect(result.current.error).toBe('User declined access'));
    expect(result.current.address).toBeNull();
    expect(result.current.connecting).toBe(false);
  });

  it('resets state on disconnect', async () => {
    mockConnectWallet.mockResolvedValueOnce('GABC123');
    const { result } = renderHook(() => useWallet());

    act(() => {
      void result.current.connect();
    });
    await waitFor(() => expect(result.current.address).toBe('GABC123'));

    act(() => {
      result.current.disconnect();
    });
    expect(result.current.address).toBeNull();
  });
});
