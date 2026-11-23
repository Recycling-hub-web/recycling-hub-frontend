'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';

import type { PortalLocale } from '../lib/locale';
import { authEn } from '../locales/portalAuth';

type Variables = Record<string, string | number>;
const format = (message: string, values: Variables = {}) =>
  message.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  );

// Operations and authentication are English-only. Keep the translation helper
// contract for existing callers without reading/changing the public-site cookie.
const english = {
  locale: 'en' as PortalLocale,
  auth: authEn,
  setLocale: (_locale: PortalLocale) => {},
  t: (message: string, values?: Variables) => format(message, values),
};
const PortalLocaleContext = createContext(english);
export const PortalLocaleProvider = ({
  children,
}: {
  initialLocale: PortalLocale;
  children: ReactNode;
}) => {
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);
  return (
    <PortalLocaleContext.Provider value={english}>
      {children}
    </PortalLocaleContext.Provider>
  );
};
export const usePortalLocale = () => useContext(PortalLocaleContext);
