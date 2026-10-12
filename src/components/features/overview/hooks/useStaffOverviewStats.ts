import { useEffect, useState } from 'react';

import type { FinanceStatus } from '../../finance/types';
import type { DailyVolumePoint } from '../../pickups/services/pickupService';
import type { PickupStatus } from '../../pickups/types';
import { getAdminOverviewStats } from '../services/overviewService';

type StaffOverviewStats = {
  pendingPickups: number | null;
  pendingMessages: number | null;
  publishedPosts: number | null;
  /** Same chart data Admin's dashboard shows — Staff is permitted to
   * call the same endpoint (IsAdminOrStaffUser), it just never
   * receives `total_users` back. */
  pickupStatusCounts: Record<PickupStatus, number> | null;
  financeStatusCounts: Record<FinanceStatus, number> | null;
  dailyVolume: DailyVolumePoint[] | null;
};

const INITIAL: StaffOverviewStats = {
  pendingPickups: null,
  pendingMessages: null,
  publishedPosts: null,
  pickupStatusCounts: null,
  financeStatusCounts: null,
  dailyVolume: null,
};

/** Same endpoint as useAdminOverviewStats (AdminOverviewStatsView is
 * shared by Admin and Staff) — Staff now gets the same charts Admin
 * has, just never a `totalUsers` value (the backend omits that field
 * for a non-admin caller; Staff has no Users module access). */
const useStaffOverviewStats = () => {
  const [stats, setStats] = useState<StaffOverviewStats>(INITIAL);

  useEffect(() => {
    let cancelled = false;

    getAdminOverviewStats()
      .then((data) => {
        if (cancelled) return;
        setStats({
          pendingPickups: data.pending_pickups,
          pendingMessages: data.pending_messages,
          publishedPosts: data.published_posts,
          pickupStatusCounts: data.pickup_status_counts,
          financeStatusCounts: data.finance_status_counts,
          dailyVolume: data.daily_pickup_volume,
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
};

export { useStaffOverviewStats };
