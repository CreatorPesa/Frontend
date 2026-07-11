export type PayoutMethod = 'mobile_money' | 'bank_transfer' | 'stellar_wallet';

export interface CreatorProfile {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  stellarAddress: string;
  isVerified: boolean;
  youtubeChannelId: string | null;
  crowdfundingGoal: CrowdfundingGoal | null;
  membershipTiers: MembershipTier[];
  createdAt: string;
}

export interface CrowdfundingGoal {
  title: string;
  targetUsdc: number;
  raisedUsdc: number;
  deadline: string | null;
}

export interface MembershipTier {
  id: string;
  name: string;
  priceUsdc: number;
  perks: string[];
}

export interface CreatorAnalyticsSummary {
  totalViews: number;
  watchTimeHours: number;
  topVideoTitle: string | null;
  subscriberCount: number;
  periodStart: string;
  periodEnd: string;
}

export interface CreatorEarningsSummary {
  totalTipsUsdc: number;
  totalSponsorshipsUsdc: number;
  pendingPayoutUsdc: number;
  lastPayoutAt: string | null;
}
