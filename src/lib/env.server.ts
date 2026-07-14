import { z } from 'zod';

const serverEnvSchema = z.object({
  OVERLAY_SIGNING_SECRET: z.string().min(16),
});

/**
 * Server-only secrets, kept out of src/lib/env.ts on purpose: everything in
 * that file is NEXT_PUBLIC_* and gets inlined into the client bundle. Only
 * import this from server components, route handlers, or middleware.
 */
export const serverEnv = serverEnvSchema.parse({
  OVERLAY_SIGNING_SECRET: process.env.OVERLAY_SIGNING_SECRET,
});
