import { useEffect, useState } from 'react';

import type { FinanceStatus } from '../../finance/types';
import type { PickupStatus } from '../../pickups/types';
import { getAdminOverviewStats } from '../services/overviewService';

type AdminOverviewStats = {
  totalUsers: number | null;
  pendingPickups: number | null;
  pendingMessages: number | null;
  publishedPosts: number | null;
  /** One count per pickup status — powers the status-breakdown
   * BarChart. `null` until the stats have resolved. */
  pickupStatusCounts: Record<PickupStatus, number> | null;
  /** One count per finance status — powers the status-breakdown
   * DonutChart (reusing the same status→color mapping as its
   * StatusBadge). */
  financeStatusCounts: Record<FinanceStatus, number> | null;
};

const INITIAL: AdminOverviewStats = {
  totalUsers: null,
  pendingPickups: null,
  pendingMessages: null,
  publishedPosts: null,
  pickupStatusCounts: null,
  financeStatusCounts: null,
};

/** Admin dashboard stats + chart data — one real server-side aggregate
 * call (AdminOverviewStatsView), replacing the 15 parallel paginated-
 * list requests this hook used to make just to read each one's `count`
 * field. `totalUsers` stays `null` for a Staff caller, since the
 * backend only includes it for an actual admin. */
const useAdminOverviewStats = () => {
  const [stats, setStats] = useState<AdminOverviewStats>(INITIAL);

  useEffect(() => {
    let cancelled = false;

    getAdminOverviewStats()
      .then((data) => {
        if (cancelled) return;
        setStats({
          totalUsers: data.total_users ?? null,
          pendingPickups: data.pending_pickups,
          pendingMessages: data.pending_messages,
          publishedPosts: data.published_posts,
          pickupStatusCounts: data.pickup_status_counts,
          financeStatusCounts: data.finance_status_counts,
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
};

export { useAdminOverviewStats };
