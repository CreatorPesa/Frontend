import { Skeleton } from '@/components/ui/Skeleton';

export default function CreatorTipLoading() {
  return (
    <div className="min-h-screen bg-ink-50 py-12">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="rounded-full" style={{ height: 88, width: 88 }} />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}
