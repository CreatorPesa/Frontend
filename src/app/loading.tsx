import { Skeleton } from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-16 items-center justify-between border-b border-ink-100 px-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-24">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>
    </div>
  );
}
