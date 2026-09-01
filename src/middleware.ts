import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// NOTE ON TRUST: this is a UX/coarse gate, not the security boundary. It
// redirects an obviously-unauthenticated or wrong-role request before a
// protected page even renders — but every backend API call is still
// independently authorized by DRF (CookieJWTAuthentication + each view's
// own permission_classes, e.g. IsAdminOrStaffUser), exactly as before this
// migration. A bug or bypass here can make the UI show/hide the wrong
// thing; it can never grant real access to data the backend wouldn't
// already allow.
//
// NOTE ON LOCALE: the admin/staff/driver/receiving/accounting/dashboard
// routes below (now served from src/app/, not src/pages/) are English-only
// for now — Next's App Router can't resolve non-default-locale (/bm/*)
// subpaths while next.config.js's legacy `i18n` block is still active for
// the still-unmigrated src/pages/ public site (confirmed empirically
// during the App Router migration; see the migration plan). So unlike the
// pre-migration version of this file, there's no /en//bm locale-prefix
// handling here anymore — redirects always go to the bare, unprefixed
// path. Real bm support for these routes returns alongside the Phase 3
// public-site i18n redesign.

const ACCESS_COOKIE = 'rh_access';

const secretKey = process.env.JWT_VERIFY_SECRET
  ? new TextEncoder().encode(process.env.JWT_VERIFY_SECRET)
  : null;

// /dashboard has no entry here — it's a bare redirect stub open to any
// authenticated role, same as RequireAuth's client-side rule; it forwards
// each user to the routes below.
const ROUTE_ROLES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/staff': ['staff'],
  '/driver': ['driver'],
  '/receiving': ['receiving_officer'],
  '/accounting': ['accounting'],
};

function requiredRoles(pathname: string): string[] | null {
  const match = Object.entries(ROUTE_ROLES).find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return match ? match[1] : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  const redirectTo = (path: string, search = '') => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    return NextResponse.redirect(url);
  };

  if (!token) {
    const next = request.nextUrl.pathname + request.nextUrl.search;
    return redirectTo('/login', `?next=${encodeURIComponent(next)}`);
  }

  if (!secretKey) {
    // JWT_VERIFY_SECRET isn't configured for this deployment — fail open
    // to "authenticated, role unknown" instead of locking everyone out.
    // RequireAuth's client-side check (which hits the real API) still
    // enforces role access correctly; this only means the edge-redirect
    // half of the gate is inactive. Set the env var in every real
    // deployment so it isn't.
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    if (payload.token_type !== 'access') {
      const next = request.nextUrl.pathname + request.nextUrl.search;
      return redirectTo('/login', `?next=${encodeURIComponent(next)}`);
    }

    const role = typeof payload.role === 'string' ? payload.role : null;
    const roles = requiredRoles(pathname);
    if (roles && (!role || !roles.includes(role))) {
      return redirectTo('/unauthorized');
    }

    return NextResponse.next();
  } catch {
    // Missing, malformed, or expired — apiFetch's silent refresh-and-retry
    // handles a still-fresh session on the client; here it just means
    // this particular request can't be gated as authenticated.
    const next = request.nextUrl.pathname + request.nextUrl.search;
    return redirectTo('/login', `?next=${encodeURIComponent(next)}`);
  }
}

// Next.js statically extracts this array at build time, so it has to be a
// plain literal — no computed/spread expression, even though it's
// mechanically "/<route>/:path*" for each protected prefix.
export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
    '/driver/:path*',
    '/receiving/:path*',
    '/accounting/:path*',
    '/dashboard/:path*',
  ],
};
