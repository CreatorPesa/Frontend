export type EscrowStatus =
  // Recorded in the dashboard but not yet funded on-chain by the brand.
  | 'proposed'
  | 'funded'
  | 'delivery_attested'
  | 'dispute_window'
  | 'disputed'
  | 'released'
  | 'refunded';

export interface SponsorshipDeal {
  id: string;
  creatorId: string;
  brandName: string;
  amountUsdc: number;
  deliverableSpec: string;
  deliverableUrl: string | null;
  status: EscrowStatus;
  disputeWindowHours: number;
  disputeWindowEndsAt: string | null;
  createdAt: string;
}

export interface CreateSponsorshipDealRequest {
  brandName: string;
  amountUsdc: number;
  deliverableSpec: string;
}
