'use client';

import { usePortalLocale } from '../../contexts/PortalLocaleContext';

/** Minimal footer for authenticated (Admin/operational) layouts — the
 * sibling Footer.tsx in this same folder is the full public-site
 * marketing footer (nav columns, social links); reusing it here would put
 * a marketing footer inside an internal tool, so this is a deliberately
 * separate, much smaller component instead of a "new version" of that one.
 * Named AppFooter (not Footer) specifically so the two can live side by
 * side in one components/layout/ without a name collision. */
const AppFooter = () => {
  const { t } = usePortalLocale();
  return (
    <footer className="p-4 text-center text-xs text-slate-600 lg:px-6">
      © {new Date().getFullYear()} Recycling Hub. {t('All rights reserved.')}
    </footer>
  );
};

export { AppFooter };
