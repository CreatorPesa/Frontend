import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { getServerSession } from '@/lib/auth/session';

export default async function HomePage() {
  // Session here only toggles the navbar's sign-in link vs. avatar — it
  // doesn't gate anything. A backend hiccup should degrade to "logged out
  // nav", not take down the public marketing page, so it's caught locally
  // rather than left to propagate to an error boundary.
  const session = await getServerSession().catch(() => null);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar session={session} />

      <main className="flex-1">
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-24 text-center">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
            Built on Stellar
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Get paid directly by your fans and sponsors — no AdSense thresholds, no weeks-long
            waits.
          </h1>
          <p className="max-w-2xl text-lg text-ink-600">
            CreatorPesa turns tips, subscriptions, and sponsorship deals into instant payouts — in
            mobile money, bank transfer, or crypto — settled in seconds on Stellar.
          </p>
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button size="lg">Get started</Button>
            </Link>
            <Link href="/#how-it-works">
              <Button size="lg" variant="secondary">
                See how it works
              </Button>
            </Link>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-ink-100 bg-ink-50/50 py-20">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
            {[
              {
                title: 'Fans tip in local currency',
                body: 'M-Pesa, Airtel Money, MTN MoMo, or bank transfer — no wallet required.',
              },
              {
                title: 'Instant settlement on Stellar',
                body: 'Payments convert to USDC and settle in seconds, split automatically between collaborators.',
              },
              {
                title: 'Cash out on your terms',
                body: 'Withdraw to mobile money or a bank account whenever you want — no $100 threshold.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-6 shadow-card">
                <h3 className="font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
