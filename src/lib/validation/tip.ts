import { z } from 'zod';

export const tipFormSchema = z.object({
  amount: z
    .number()
    .nullable()
    .refine((val): val is number => val !== null && val > 0, {
      message: 'Choose an amount to tip.',
    }),
  method: z
    .enum(['mpesa', 'airtel_money', 'mtn_momo', 'bank_transfer', 'crypto_wallet'])
    .nullable()
    .refine((val): val is NonNullable<typeof val> => val !== null, {
      message: 'Choose a payment method.',
    }),
});
