import { useEffect, useState } from 'react';

import { listBlogPosts } from '../../blogs/services/blogService';
import { listContactMessages } from '../../contact/services/contactService';
import { listFinanceRecords } from '../../finance/services/financeService';
import type { FinanceStatus } from '../../finance/types';
import {
  type DailyVolumePoint,
  getDailyPickupVolume,
  listPickupRequests,
} from '../../pickups/services/pickupService';
import type { PickupStatus } from '../../pickups/types';
import { listUsers } from '../../users/services/userService';

type AdminOverviewStats = {
  totalUsers: number | null;
  pendingPickups: number | null;
  pendingMessages: number | null;
  publishedPosts: number | null;
  /** One count per pickup status — powers the status-breakdown
   * BarChart. `null` until every status' count has resolved. */
  pickupStatusCounts: Record<PickupStatus, number> | null;
  /** One count per finance status — powers the status-breakdown
   * DonutChart (reusing the same status→color mapping as its
   * StatusBadge). */
  financeStatusCounts: Record<FinanceStatus, number> | null;
  /** Daily pickup request volume, last 30 days — powers the trend
   * LineChart. See CollectionRequestViewSet.daily_volume. */
  dailyVolume: DailyVolumePoint[] | null;
};

const PICKUP_STATUSES: PickupStatus[] = [
  'pending',
  'scheduled',
  'collected',
  'delivered',
  'closed',
  'cancelled',
];

const FINANCE_STATUSES: FinanceStatus[] = [
  'pending',
  'claimed',
  'verified',
  'reimbursed',
];

const INITIAL: AdminOverviewStats = {
  totalUsers: null,
  pendingPickups: null,
  pendingMessages: null,
  publishedPosts: null,
  pickupStatusCounts: null,
  financeStatusCounts: null,
  dailyVolume: null,
};

/** Admin dashboard stats + chart data — every count comes off an
 * existing paginated list endpoint's `count` field (the real
 * server-side total for that filter, not just the page fetched), so
 * only the trend chart (`dailyVolume`) needed a new backend endpoint;
 * nothing else does. Fetched in parallel; each field stays `null`
 * (renders as a loading state) until its own request resolves, rather
 * than blocking everything on the slowest one. */
const useAdminOverviewStats = () => {
  const [stats, setStats] = useState<AdminOverviewStats>(INITIAL);

  useEffect(() => {
    let cancelled = false;

    listUsers({ page: 1 })
      .then((data) => {
        if (!cancelled)
          setStats((prev) => ({ ...prev, totalUsers: data.count }));
      })
      .catch(() => {});
    listContactMessages({ status: 'pending' })
      .then((data) => {
        if (!cancelled)
          setStats((prev) => ({ ...prev, pendingMessages: data.count }));
      })
      .catch(() => {});
    listBlogPosts({ status: 'published', page_size: 1 })
      .then((data) => {
        if (!cancelled)
          setStats((prev) => ({ ...prev, publishedPosts: data.count }));
      })
      .catch(() => {});
    getDailyPickupVolume(30)
      .then((data) => {
        if (!cancelled) setStats((prev) => ({ ...prev, dailyVolume: data }));
      })
      .catch(() => {});

    Promise.all(
      PICKUP_STATUSES.map((status) =>
        listPickupRequests({ status }).then(
          (data) => [status, data.count] as const,
        ),
      ),
    )
      .then((pairs) => {
        if (cancelled) return;
        const pickupStatusCounts = Object.fromEntries(pairs) as Record<
          PickupStatus,
          number
        >;
        setStats((prev) => ({
          ...prev,
          pendingPickups: pickupStatusCounts.pending,
          pickupStatusCounts,
        }));
      })
      .catch(() => {});

    Promise.all(
      FINANCE_STATUSES.map((status) =>
        listFinanceRecords({ status }).then(
          (data) => [status, data.count] as const,
        ),
      ),
    )
      .then((pairs) => {
        if (cancelled) return;
        setStats((prev) => ({
          ...prev,
          financeStatusCounts: Object.fromEntries(pairs) as Record<
            FinanceStatus,
            number
          >,
        }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
};

export { useAdminOverviewStats };
