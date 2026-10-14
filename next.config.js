/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Security headers (security audit M-11, L-1). The enforced CSP holds only
// directives that can't break a page; the full policy runs Report-Only
// until its reports are clean, then can be enforced.
const ENFORCED_CSP = [
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const REPORT_ONLY_CSP = [
  "default-src 'self'",
  // Next's dev server (hot reload) evaluates strings; production doesn't.
  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"
  }`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  // Uploaded files come from the storage bucket, whose host differs per
  // environment; uploads PUT straight to it.
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

// Internal areas never belong in search results; on non-production
// deployments (e.g. staging) nothing does.
const INTERNAL_PREFIXES = [
  '/admin',
  '/super-admin',
  '/staff',
  '/driver',
  '/receiving',
  '/accounting',
  '/profile',
  '/dashboard',
  '/login',
];
const isProductionDeployment =
  !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: false,
  // Without this, Next's own trailingSlash:false handling 308-redirects
  // `/api/v1/accounts/me/` → `/api/v1/accounts/me` *before* rewrites()
  // ever runs — turning every proxied API call into an extra round trip
  // (and DRF's URLs expect the trailing slash anyway, even though
  // FlexibleTrailingSlashMiddleware tolerates either). This is the
  // documented fix for exactly this "proxying to a backend with different
  // trailing-slash rules" case.
  skipTrailingSlashRedirect: true,
  basePath: '',
  i18n: {
    locales: ['en', 'bm'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  // Proxies API calls through this app's own origin so the browser only
  // ever talks to one host — auth now runs on httpOnly cookies, and
  // cross-origin cookies need SameSite=None+Secure (fragile in local dev,
  // more CORS config everywhere). Same-origin sidesteps all of that:
  // cookies are plain SameSite=Lax, dev and prod behave identically.
  // NEXT_PUBLIC_API_URL should be the relative path "/api/v1" for this to
  // apply; API_PROXY_TARGET (server-only, not NEXT_PUBLIC_) is the real
  // backend origin it forwards to.
  async headers() {
    const noindex = { key: 'X-Robots-Tag', value: 'noindex, nofollow' };
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: ENFORCED_CSP },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: REPORT_ONLY_CSP,
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), payment=(), geolocation=(self)',
          },
          ...(isProductionDeployment ? [] : [noindex]),
        ],
      },
      ...INTERNAL_PREFIXES.flatMap((prefix) => [
        { source: prefix, headers: [noindex] },
        { source: `${prefix}/:path*`, headers: [noindex] },
      ]),
    ];
  },
  async rewrites() {
    const target = process.env.API_PROXY_TARGET;
    if (!target) return [];
    return [
      { source: '/api/v1/:path*', destination: `${target}/api/v1/:path*` },
    ];
  },
});
