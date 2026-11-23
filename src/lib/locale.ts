export type PortalLocale = 'en' | 'bm';
export const LOCALE_COOKIE = 'NEXT_LOCALE';
export const parseLocale = (value: string | undefined): PortalLocale =>
  value === 'bm' ? 'bm' : 'en';

/** This preference cookie contains only a language code, never session data. */
export const saveLocale = (locale: PortalLocale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
};
