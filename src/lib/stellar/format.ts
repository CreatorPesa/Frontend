export function truncateAddress(address: string, lead = 4, tail = 4): string {
  if (address.length <= lead + tail) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

export function explorerUrl(txHash: string, network: 'testnet' | 'mainnet'): string {
  const base =
    network === 'mainnet'
      ? 'https://stellar.expert/explorer/public'
      : 'https://stellar.expert/explorer/testnet';
  return `${base}/tx/${txHash}`;
}
