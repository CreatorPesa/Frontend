'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { updateMembershipTiers } from '@/lib/api/membership';
import { membershipTiersSchema } from '@/lib/validation/membership';
import type { MembershipTier } from '@/types/creator';

function emptyTier(): MembershipTier {
  return { id: '', name: '', priceUsdc: 0, perks: [] };
}

export function MembershipTierManager({
  creatorId,
  initialTiers,
}: {
  creatorId: string;
  initialTiers: MembershipTier[];
}) {
  const [tiers, setTiers] = useState(initialTiers);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateTier(index: number, patch: Partial<MembershipTier>) {
    setTiers((prev) => prev.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)));
  }

  function removeTier(index: number) {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  }

  function addTier() {
    setTiers((prev) => [...prev, emptyTier()]);
  }

  async function handleSave() {
    const result = membershipTiersSchema.safeParse({ tiers });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check your tiers and try again.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const saved = await updateMembershipTiers(creatorId, result.data.tiers);
      setTiers(saved);
    } catch {
      setError('Failed to save membership tiers. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership tiers</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <p className="text-sm text-ink-500">
          Shown to fans on your public tipping page as recurring subscription options.
        </p>

        {tiers.map((tier, index) => (
          <div
            key={index}
            className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_140px_2fr_auto]"
          >
            <Input
              label="Name"
              value={tier.name}
              onChange={(e) => updateTier(index, { name: e.target.value })}
            />
            <Input
              label="Price (USDC/mo)"
              type="number"
              min={0}
              step="0.01"
              value={tier.priceUsdc}
              onChange={(e) => updateTier(index, { priceUsdc: Number(e.target.value) })}
            />
            <Input
              label="Perks (comma-separated)"
              value={tier.perks.join(', ')}
              onChange={(e) =>
                updateTier(index, {
                  perks: e.target.value
                    .split(',')
                    .map((perk) => perk.trim())
                    .filter(Boolean),
                })
              }
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeTier(index)}>
              Remove
            </Button>
          </div>
        ))}

        <button
          type="button"
          onClick={addTier}
          className="self-start text-sm font-medium text-brand-700 hover:underline"
        >
          + Add tier
        </button>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button onClick={handleSave} isLoading={saving} className="self-start">
          Save tiers
        </Button>
      </CardBody>
    </Card>
  );
}
