import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { ASSETS } from '../../constants/content';

type AuthCardProps = {
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

/** Shared chrome for every /login, /verify-otp, /forgot-password,
 * /reset-password, /set-password, /account-locked, /unauthorized screen —
 * logo, icon badge + heading + subtitle + a content slot for the
 * form/body. Same logo lockup as the public navbar: the combined
 * wordmark+symbol from sm breakpoint up, the symbol mark alone below it —
 * these are the most-viewed-by-width pages in the app, so the mobile
 * layout matters here as much as anywhere. */
const AuthCard = ({ icon, title, subtitle, children }: AuthCardProps) => (
  <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link href="/" className="flex justify-center">
        <Image
          src={ASSETS.logo.combinedColor}
          alt="Recycling Hub"
          width={3100}
          height={700}
          className="hidden h-8 w-auto object-contain sm:block"
          priority
        />
        <Image
          src={ASSETS.logo.symbolColor}
          alt="Recycling Hub"
          width={560}
          height={565}
          className="size-8 object-contain sm:hidden"
          priority
        />
      </Link>

      <div className="mt-6 flex size-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        {icon}
      </div>
      <h1 className="mt-4 font-montserrat text-xl font-bold text-neutral-950">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      {children}
    </div>
  </div>
);

export { AuthCard };
