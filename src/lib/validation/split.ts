import { z } from 'zod';

export const splitConfigSchema = z
  .object({
    recipients: z.array(
      z.object({
        label: z.string().min(1, 'Every recipient needs a label.'),
        stellarAddress: z.string().min(1, 'Every recipient needs a Stellar address.'),
        bps: z.number().min(0),
      }),
    ),
  })
  .refine((data) => data.recipients.reduce((sum, r) => sum + r.bps, 0) === 10000, {
    message: 'Splits must add up to exactly 100%.',
    path: ['recipients'],
  });
