export type PayoutStatus = 'requested' | 'processing' | 'completed' | 'failed';

export interface PayoutRequest {
  id: string;
  creatorId: string;
  amountUsdc: number;
  method: 'mobile_money' | 'bank_transfer';
  status: PayoutStatus;
  requestedAt: string;
  completedAt: string | null;
}

export interface RealtimeEvent<T = unknown> {
  type: 'tip_received' | 'payout_status' | 'sponsorship_status';
  creatorId: string;
  payload: T;
}
