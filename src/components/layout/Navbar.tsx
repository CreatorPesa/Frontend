import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import type { Session } from '@/lib/auth/session';

export function Navbar({ session }: { session: Session | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-ink-900">
          CreatorPesa
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-600 md:flex">
          <Link href="/#how-it-works" className="hover:text-ink-900">
            How it works
          </Link>
          <Link href="/#creators" className="hover:text-ink-900">
            For creators
          </Link>
        </nav>

        {session ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Avatar name={session.displayName} size={32} />
            <span className="hidden text-sm font-medium text-ink-800 sm:inline">
              {session.displayName}
            </span>
          </Link>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
