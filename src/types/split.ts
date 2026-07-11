export interface RevenueSplitRecipient {
  label: string;
  stellarAddress: string;
  bps: number;
}

export interface RevenueSplitConfig {
  creatorId: string;
  recipients: RevenueSplitRecipient[];
  /** Recipients' bps must sum to exactly this value. */
  totalBps: 10000;
  updatedAt: string;
}
