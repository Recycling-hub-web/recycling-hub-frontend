import { apiFetch } from '../../../../lib/api';
import type { Driver } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// GET /accounts/drivers/ — admin/staff only (see DriverListView on the
// backend), solely so the assign-driver action here has someone to
// pick. Same pagination-following as collectorService.ts's
// listCollectors, for the same reason (plain PageNumberPagination, no
// page_size override).
const MAX_PAGES = 20;

const nextPageQuery = (next: string | null): string | null => {
  if (!next) return null;
  try {
    return new URL(next).search;
  } catch {
    return next.includes('?') ? next.slice(next.indexOf('?')) : null;
  }
};

const listDrivers = async (): Promise<Driver[]> => {
  const drivers: Driver[] = [];
  let query = '';
  let pages = 0;

  do {
    // eslint-disable-next-line no-await-in-loop
    const page: Paginated<Driver> = await apiFetch(
      `/accounts/drivers/${query}`,
    );
    drivers.push(...page.results);
    const next = nextPageQuery(page.next);
    if (!next) break;
    query = next;
    pages += 1;
  } while (pages < MAX_PAGES);

  return drivers;
};

export { listDrivers };
