'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { type PortalLocale, saveLocale } from '../lib/locale';
import { portalBm } from '../locales/portal';
import { authBm, authEn } from '../locales/portalAuth';

type Variables = Record<string, string | number>;
const format = (message: string, values: Variables = {}) =>
  message.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  );
const PortalLocaleContext = createContext({
  locale: 'en' as PortalLocale,
  auth: authEn,
  setLocale: (_locale: PortalLocale) => {},
  t: (message: string, values?: Variables) => format(message, values),
});

export const PortalLocaleProvider = ({
  initialLocale,
  children,
}: {
  initialLocale: PortalLocale;
  children: ReactNode;
}) => {
  const [locale, setLocaleState] = useState(initialLocale);
  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);
  useEffect(() => {
    document.documentElement.lang = locale === 'bm' ? 'ms' : 'en';
  }, [locale]);
  const value = useMemo(
    () => ({
      locale,
      auth: locale === 'bm' ? authBm : authEn,
      setLocale: (next: PortalLocale) => {
        saveLocale(next);
        setLocaleState(next);
      },
      t: (message: string, values?: Variables) =>
        format(
          locale === 'bm' ? portalBm[message] ?? message : message,
          values,
        ),
    }),
    [locale],
  );
  return (
    <PortalLocaleContext.Provider value={value}>
      {children}
    </PortalLocaleContext.Provider>
  );
};
export const usePortalLocale = () => useContext(PortalLocaleContext);
