import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-16 items-center justify-between border-b border-ink-100 px-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-6">
        <div className="hidden w-56 shrink-0 flex-col gap-2 py-6 md:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-4 py-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
