/**
 * Guards every place a `?next=` value gets fed into a redirect. Only a
 * single leading "/" counts as safe — rejects protocol-relative URLs
 * ("//evil.com", browsers treat that as an absolute URL), absolute URLs,
 * and anything else that isn't a plain in-app path. Without this, an
 * attacker-crafted `?next=` on a login link could bounce a user
 * off-site right after they authenticate.
 */
const isSafeRedirectPath = (path: string | null | undefined): path is string =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');

export { isSafeRedirectPath };
