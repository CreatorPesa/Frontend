import { z } from 'zod';

export const membershipTiersSchema = z.object({
  tiers: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Every tier needs a name.'),
      priceUsdc: z.number().positive('Tier price must be greater than zero.'),
      perks: z.array(z.string()),
    }),
  ),
});
