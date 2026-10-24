import '../styles/global.css';

import type { Metadata } from 'next';

import { Providers } from './providers';

// Root layout for the App Router side of the app (src/app/) — same
// responsibility src/pages/_document.tsx + _app.tsx have for the Pages
// Router side (fonts, global CSS, provider tree).
//
// English-only for now, deliberately: Next's App Router cannot resolve
// non-default-locale (bm) subpaths while next.config.js's legacy `i18n`
// block is still active for the still-unmigrated src/pages/ public site —
// confirmed empirically (a bare [locale] segment 404s on every /bm/*
// request; Next's i18n routing layer strips/normalizes the locale prefix
// before App Router's own dynamic-segment matching ever sees it, and only
// the default locale's normalization happens to degenerate into something
// App Router can still resolve). Real bm support for these routes is
// follow-up work alongside the Phase 3 public-site i18n redesign (see the
// App Router migration plan), not a gap introduced casually here.
export const metadata: Metadata = {
  title: 'Recycling Hub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this
            IS the App Router root layout, the same site-wide role
            src/pages/_document.tsx (which the rule doesn't flag) plays for
            the Pages Router side; the rule just doesn't know that yet. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
