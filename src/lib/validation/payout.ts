import { z } from 'zod';

export function payoutFormSchema(availableUsdc: number) {
  return z.object({
    amountUsdc: z
      .number()
      .positive('Enter an amount greater than zero.')
      .max(availableUsdc, `You can withdraw up to ${availableUsdc.toFixed(2)} USDC.`),
    method: z.enum(['mobile_money', 'bank_transfer']),
  });
}
