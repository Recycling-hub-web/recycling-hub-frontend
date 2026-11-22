/* eslint-disable no-control-regex -- Reject control characters in redirect targets. */
import { ROLE_HOME, type UserRole } from '../types/auth';

/** Only application-local destinations survive login; normalize before role checks. */
const safeReturnPath = (value: string | null | undefined): string | null => {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return null;
  try {
    const url = new URL(value, 'https://recyclinghub.invalid');
    const decodedPath = decodeURIComponent(url.pathname);
    if (
      url.origin !== 'https://recyclinghub.invalid' ||
      decodedPath.startsWith('//') ||
      /[\\\u0000-\u001f]/.test(decodedPath)
    )
      return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};

const returnPathForRole = (
  value: string | null | undefined,
  role: UserRole,
): string => {
  const path = safeReturnPath(value);
  const home = ROLE_HOME[role];
  if (!path) return home;
  const { pathname } = new URL(path, 'https://recyclinghub.invalid');
  const bases = [
    home,
    '/profile',
    ...(role === 'super_admin' ? ['/admin'] : []),
  ];
  return bases.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  )
    ? path
    : home;
};

const loginPathFor = (destination: string | null | undefined) => {
  const path = safeReturnPath(destination);
  return path ? `/login?next=${encodeURIComponent(path)}` : '/login';
};

export { loginPathFor, returnPathForRole, safeReturnPath };
