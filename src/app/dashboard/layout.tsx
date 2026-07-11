import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getServerSession } from '@/lib/auth/session';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/sign-in?from=/dashboard');
  }

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
