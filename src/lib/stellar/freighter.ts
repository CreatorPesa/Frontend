import freighterApi from '@stellar/freighter-api';
import { env } from '@/lib/env';

export class WalletError extends Error {}

/**
 * Non-custodial by design: the frontend never sees a private key, only
 * Freighter's connect/sign prompts.
 */
export async function isFreighterInstalled(): Promise<boolean> {
  return freighterApi.isConnected();
}

export async function connectWallet(): Promise<string> {
  let publicKey: string;
  try {
    publicKey = await freighterApi.requestAccess();
  } catch (err) {
    throw new WalletError(err instanceof Error ? err.message : 'Failed to connect to Freighter.');
  }

  const network = await freighterApi.getNetwork();
  const expectedNetwork = env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'PUBLIC' : 'TESTNET';
  if (network !== expectedNetwork) {
    throw new WalletError(
      `Freighter is set to ${network}, but this app expects ${expectedNetwork}. Switch networks in the Freighter extension.`,
    );
  }

  return publicKey;
}

export async function signTransaction(xdr: string): Promise<string> {
  try {
    return await freighterApi.signTransaction(xdr, {
      networkPassphrase:
        env.NEXT_PUBLIC_NETWORK === 'mainnet'
          ? 'Public Global Stellar Network ; September 2015'
          : 'Test SDF Network ; September 2015',
    });
  } catch (err) {
    throw new WalletError(err instanceof Error ? err.message : 'Failed to sign transaction.');
  }
}
