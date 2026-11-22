'use client';

import { usePortalLocale } from '../../contexts/PortalLocaleContext';

export const PortalLanguageSwitcher = () => {
  const { locale, setLocale, t } = usePortalLocale();
  return (
    <div
      role="group"
      aria-label={t('Language')}
      className="inline-flex shrink-0 rounded-full border border-slate-300 bg-white p-0.5 text-xs font-semibold"
    >
      {(['en', 'bm'] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={locale === value}
          onClick={() => setLocale(value)}
          className={`min-h-9 min-w-9 rounded-full px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${locale === value ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          {value === 'en' ? 'EN' : 'BM'}
        </button>
      ))}
    </div>
  );
};
