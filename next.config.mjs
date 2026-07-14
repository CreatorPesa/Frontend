import withBundleAnalyzerFactory from '@next/bundle-analyzer';

const withBundleAnalyzer = withBundleAnalyzerFactory({
  enabled: process.env.ANALYZE === 'true',
});

// script-src/style-src intentionally omit a nonce: Next 14.2.x has an open
// advisory (GHSA-ffhc-5mcf-pf4q) where CSP nonces on App Router pages can
// themselves be leaked/bypassed, so a nonce-based policy here would be a
// false sense of protection rather than a real one. 'unsafe-inline' is what
// Next 14's hydration bootstrap needs without that extra (currently unsafe)
// wiring; this header still meaningfully restricts framing, MIME sniffing,
// and which origins the app will fetch/connect to.
const connectSrc = [
  "'self'",
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_WS_URL,
  process.env.NEXT_PUBLIC_HORIZON_URL,
  process.env.NEXT_PUBLIC_SOROBAN_RPC,
]
  .filter(Boolean)
  .join(' ');

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://yt3.googleusercontent.com https://lh3.googleusercontent.com",
  `connect-src ${connectSrc}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
