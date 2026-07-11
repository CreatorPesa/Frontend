import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { googleSignInUrl } from '@/lib/auth/session';

export default function SignInPage({ searchParams }: { searchParams: { from?: string } }) {
  const redirectTo = searchParams.from ?? '/dashboard';

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <Card className="w-full max-w-sm">
        <CardBody className="flex flex-col items-center gap-6 py-10 text-center">
          <Link href="/" className="text-lg font-semibold text-ink-900">
            CreatorPesa
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-ink-900">Sign in to your dashboard</h1>
            <p className="mt-1 text-sm text-ink-500">
              We verify your channel with YouTube read-only access — we never touch your ad revenue.
            </p>
          </div>
          <a href={googleSignInUrl(redirectTo)} className="w-full">
            <Button size="lg" className="w-full">
              Continue with Google
            </Button>
          </a>
        </CardBody>
      </Card>
    </div>
  );
}
