/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
  async rewrites() {
    const target = process.env.API_PROXY_TARGET;
    if (!target) return [];
    return [
      { source: '/api/v1/:path*', destination: `${target}/api/v1/:path*` },
    ];
  },
});
