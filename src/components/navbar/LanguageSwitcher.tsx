import Link from 'next/link';
import { useRouter } from 'next/router';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'bm', label: 'BM' },
] as const;

type LanguageSwitcherProps = {
  light: boolean;
  className?: string;
};

const LanguageSwitcher = ({ light, className = '' }: LanguageSwitcherProps) => {
  const router = useRouter();
  const activeLocale = router.locale ?? 'en';
  // router.asPath includes the query string, which isn't known during the
  // initial static render — using it unconditionally causes a hydration
  // mismatch on pages with a query (e.g. /request-quote?service=...). Fall
  // back to the stable pathname until the router has hydrated.
  const currentPath = router.isReady ? router.asPath : router.pathname;

  const containerCls = light
    ? 'border-slate-200 bg-white'
    : 'border-white/20 bg-white/5';
  const idleCls = light
    ? 'text-slate-400 hover:text-neutral-950'
    : 'text-white/50 hover:text-white';
  const activeCls = light
    ? 'bg-brand-50 text-brand-600'
    : 'bg-white/15 text-white';

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border p-0.5 text-xs font-semibold ${containerCls} ${className}`}
    >
      {LOCALES.map(({ code, label }) => {
        const active = activeLocale === code;
        return (
          <Link
            key={code}
            href={currentPath}
            locale={code}
            aria-current={active}
            className={`rounded-full px-2.5 py-1 transition-colors duration-150 ${
              active ? activeCls : idleCls
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export { LanguageSwitcher };
