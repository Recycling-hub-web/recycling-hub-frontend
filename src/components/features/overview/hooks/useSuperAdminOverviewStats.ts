import { useEffect, useState } from 'react';

import type { UserRole } from '../../../../types/auth';
import { getSuperAdminOverviewStats } from '../services/overviewService';

type SuperAdminOverviewStats = {
  usersByRole: Record<UserRole, number> | null;
  totalPickupsThisMonth: number | null;
  totalReimbursedThisMonth: number | null;
  activeCollectionPoints: number | null;
  activeServiceAreas: number | null;
};

const INITIAL: SuperAdminOverviewStats = {
  usersByRole: null,
  totalPickupsThisMonth: null,
  totalReimbursedThisMonth: null,
  activeCollectionPoints: null,
  activeServiceAreas: null,
};

/** Organization-wide stats for Super Admin's own dashboard
 * (SuperAdminOverviewStatsView) — separate from the admin/super-admin
 * seat limits useRoleLimits already covers; this is everything else:
 * headcount by role and org-wide operational/finance volume. */
const useSuperAdminOverviewStats = () => {
  const [stats, setStats] = useState<SuperAdminOverviewStats>(INITIAL);

  useEffect(() => {
    let cancelled = false;

    getSuperAdminOverviewStats()
      .then((data) => {
        if (cancelled) return;
        setStats({
          usersByRole: data.users_by_role,
          totalPickupsThisMonth: data.total_pickups_this_month,
          totalReimbursedThisMonth: Number(data.total_reimbursed_this_month),
          activeCollectionPoints: data.active_collection_points,
          activeServiceAreas: data.active_service_areas,
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
};

export { useSuperAdminOverviewStats };
