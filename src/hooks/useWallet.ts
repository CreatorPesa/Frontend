'use client';

import { useCallback, useState } from 'react';
import { connectWallet, WalletError } from '@/lib/stellar/freighter';

interface WalletState {
  address: string | null;
  connecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    connecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, connecting: true, error: null }));
    try {
      const address = await connectWallet();
      setState({ address, connecting: false, error: null });
    } catch (err) {
      const message = err instanceof WalletError ? err.message : 'Failed to connect wallet.';
      setState({ address: null, connecting: false, error: message });
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({ address: null, connecting: false, error: null });
  }, []);

  return { ...state, connect, disconnect };
}
