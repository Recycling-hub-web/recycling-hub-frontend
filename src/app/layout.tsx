import '../styles/global.css';

import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';

import { LOCALE_COOKIE, parseLocale } from '../lib/locale';
import { Providers } from './providers';

// Root layout for the App Router side of the app (src/app/) — same
// responsibility src/pages/_document.tsx + _app.tsx have for the Pages
// Router side (fonts, global CSS, provider tree).
//
// Portal routes keep stable URLs and obtain their locale from the shared preference.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Brand green, from the logo kit.
  themeColor: '#2E7D32',
};

// Same icon set as the public pages (components/layout/Meta.tsx).
export const metadata: Metadata = {
  title: 'Recycling Hub',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);
  return (
    <html lang={locale === 'bm' ? 'ms' : 'en'}>
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
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
