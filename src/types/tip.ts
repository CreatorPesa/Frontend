export type TipPaymentMethod =
  | 'mpesa'
  | 'airtel_money'
  | 'mtn_momo'
  | 'bank_transfer'
  | 'crypto_wallet';

export type TipStatus = 'initiated' | 'converted' | 'settled' | 'failed';

export interface Tip {
  id: string;
  creatorId: string;
  fromName: string | null;
  message: string | null;
  amountUsdc: number;
  method: TipPaymentMethod;
  status: TipStatus;
  txHash: string | null;
  createdAt: string;
}

export interface CreateTipRequest {
  creatorHandle: string;
  amountUsdc: number;
  method: TipPaymentMethod;
  fromName?: string;
  message?: string;
}

export interface CreateTipResponse {
  tipId: string;
  /** URL the client redirects to in order to complete the anchor's SEP-24 deposit flow. */
  depositUrl: string;
}
