import { apiFetch } from '../../../../lib/api';
import type { Collector } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// GET /accounts/staff/ — open to admin and staff (see
// StaffManagementView.get_permissions on the backend), solely so the
// schedule action here has someone to pick as the collector.
//
// The endpoint's pagination is plain PageNumberPagination with no
// page_size override, so a single request only ever returns PAGE_SIZE
// (12) profiles — not enough to assume every org's whole staff roster
// fits on one page. Follows `next` until the full list is in, capped so
// a runaway `next` chain can't loop forever.
const MAX_PAGES = 20;

// `next` comes back as an absolute URL (DRF's PageNumberPagination
// builds one from the request) — apiFetch always prepends its own
// API_URL to whatever path it's given, so passing that absolute URL
// straight through would double up. Only the query string is needed.
const nextPageQuery = (next: string | null): string | null => {
  if (!next) return null;
  try {
    return new URL(next).search;
  } catch {
    // Already a relative path/query (e.g. in a test environment without
    // a full origin) — use it as-is.
    return next.includes('?') ? next.slice(next.indexOf('?')) : null;
  }
};

const listCollectors = async (): Promise<Collector[]> => {
  const collectors: Collector[] = [];
  let query = '';
  let pages = 0;

  do {
    // Pages must be fetched in order to follow `next`, not in parallel.
    // eslint-disable-next-line no-await-in-loop
    const page: Paginated<Collector> = await apiFetch(
      `/accounts/staff/${query}`,
    );
    collectors.push(...page.results);
    const next = nextPageQuery(page.next);
    if (!next) break;
    query = next;
    pages += 1;
  } while (pages < MAX_PAGES);

  return collectors;
};

export { listCollectors };
