import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import type { Session } from '@/lib/auth/session';

export function DashboardShell({ session, children }: { session: Session; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar session={session} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 sm:px-6">
        <Sidebar />
        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
