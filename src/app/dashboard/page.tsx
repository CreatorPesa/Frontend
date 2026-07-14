import { cookies } from 'next/headers';
import { EarningsSummaryCard } from '@/components/dashboard/EarningsSummaryCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { LiveRecentTips } from '@/components/dashboard/LiveRecentTips';
import { getCreatorAnalytics, getCreatorEarnings, getMyCreatorProfile } from '@/lib/api/creators';
import { getRecentTips } from '@/lib/api/tips';
import { buildEstimatedViewSeries } from '@/lib/utils/analytics';

export default async function DashboardOverviewPage() {
  const cookieHeader = cookies().toString();
  const creator = await getMyCreatorProfile(cookieHeader);
  const [earnings, analytics, tips] = await Promise.all([
    getCreatorEarnings(creator.id, cookieHeader),
    getCreatorAnalytics(creator.id, cookieHeader),
    getRecentTips(creator.id, cookieHeader),
  ]);

  const viewSeries = buildEstimatedViewSeries(analytics.totalViews);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Welcome back, {creator.displayName}</h1>
        <p className="text-sm text-ink-500">Here&apos;s how your channel is earning.</p>
      </div>

      <EarningsSummaryCard earnings={earnings} />
      <AnalyticsChart data={viewSeries} estimated />
      <LiveRecentTips creatorId={creator.id} initialTips={tips} />
    </div>
  );
}
