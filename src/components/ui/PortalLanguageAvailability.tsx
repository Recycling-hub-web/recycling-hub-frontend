'use client';

import { usePathname } from 'next/navigation';

import { usePortalLocale } from '../../contexts/PortalLocaleContext';

/** Be explicit about modules whose workflow copy has not been migrated yet. */
export const PortalLanguageAvailability = () => {
  const { locale, t } = usePortalLocale();
  const pathname = usePathname();
  if (locale !== 'bm' || /\/finance(?:\/[^/]+)?\/?$/.test(pathname ?? ''))
    return null;
  return (
    <p className="mx-4 mb-4 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900">
      {t('Other operations modules are currently available in English.')}
    </p>
  );
};
