import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_WS_URL: z.string().min(1),
  NEXT_PUBLIC_NETWORK: z.enum(['testnet', 'mainnet']),
  NEXT_PUBLIC_HORIZON_URL: z.string().url(),
  NEXT_PUBLIC_SOROBAN_RPC: z.string().url(),
  NEXT_PUBLIC_ESCROW_CONTRACT_ID: z.string().optional().default(''),
  NEXT_PUBLIC_SPLITTER_CONTRACT_ID: z.string().optional().default(''),
  NEXT_PUBLIC_REGISTRY_CONTRACT_ID: z.string().optional().default(''),
  NEXT_PUBLIC_SESSION_COOKIE_NAME: z.string().min(1).default('cp_session'),
});

/**
 * Validated at import time so a missing/malformed env var fails fast at build
 * or server start, rather than surfacing as an obscure runtime error later.
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_HORIZON_URL: process.env.NEXT_PUBLIC_HORIZON_URL,
  NEXT_PUBLIC_SOROBAN_RPC: process.env.NEXT_PUBLIC_SOROBAN_RPC,
  NEXT_PUBLIC_ESCROW_CONTRACT_ID: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID,
  NEXT_PUBLIC_SPLITTER_CONTRACT_ID: process.env.NEXT_PUBLIC_SPLITTER_CONTRACT_ID,
  NEXT_PUBLIC_REGISTRY_CONTRACT_ID: process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID,
  NEXT_PUBLIC_SESSION_COOKIE_NAME: process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME,
});
