'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/stellar/format';

export function WalletConnectCard() {
  const { address, connecting, error, connect, disconnect } = useWallet();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stellar wallet</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-3">
        <p className="text-sm text-ink-500">
          Connect Freighter to link a Stellar wallet to your account. CreatorPesa never sees your
          private key — only the connect and sign prompts. Signing payout and revenue-split
          transactions with this wallet is not wired up yet; that depends on the `backend` and
          `contracts` repos landing first.
        </p>

        {address ? (
          <div className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2">
            <div className="flex items-center gap-2">
              <Badge tone="success">Connected</Badge>
              <span className="font-mono text-sm text-ink-800">{truncateAddress(address)}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={connect} isLoading={connecting} className="self-start">
            Connect Freighter
          </Button>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
