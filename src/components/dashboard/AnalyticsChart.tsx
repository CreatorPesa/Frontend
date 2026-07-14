'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

interface DataPoint {
  date: string;
  views: number;
}

export function AnalyticsChart({
  data,
  estimated = false,
}: {
  data: DataPoint[];
  /** True when `data` is a smoothed placeholder rather than real per-day analytics. */
  estimated?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Views (last 14 days)</CardTitle>
        {estimated && (
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500">
            Estimated
          </span>
        )}
      </CardHeader>
      <CardBody className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1ab074" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1ab074" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#a1a9b3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#0f8f5e"
              strokeWidth={2}
              fill="url(#viewsFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
