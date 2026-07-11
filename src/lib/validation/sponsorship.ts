import { z } from 'zod';

export const sponsorshipDealSchema = z.object({
  brandName: z.string().min(1, 'Enter the brand name.'),
  amountUsdc: z.number().positive('Enter an amount greater than zero.'),
  deliverableSpec: z.string().min(1, 'Describe what you’ll deliver.'),
});
