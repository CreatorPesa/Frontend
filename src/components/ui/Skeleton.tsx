import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div style={style} className={cn('animate-pulse rounded-md bg-ink-100', className)} />;
}
