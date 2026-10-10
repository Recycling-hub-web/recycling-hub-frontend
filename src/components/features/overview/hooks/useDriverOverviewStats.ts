import { useEffect, useState } from 'react';

import { listFinanceRecords } from '../../finance/services/financeService';
import type { FinanceStatus } from '../../finance/types';
import { usePickupRequests } from '../../pickups/hooks';
import { listPickupRequests } from '../../pickups/services/pickupService';
import type { PickupStatus } from '../../pickups/types';

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

/** Driver's own "today" picture — both numbers come straight from the
 * same two scoped queries DriverPickupsView itself already runs
 * (status=pending → the open/claimable pool, status=scheduled → the
 * driver's own assignments; both server-scoped to this driver, see
 * CollectionRequestViewSet.get_queryset's driver branch). "Open route"
 * isn't a separate endpoint — every row already carries its own
 * `route` field, so an open route's stop count is just how many of
 * the driver's `scheduled` rows currently point at a route still
 * `status: 'open'`. The `mine` query's own rows are returned too, for
 * the overview's short "My assigned pickups" preview table — same
 * data, no second fetch (same pattern as useReceivingOverviewStats).
 *
 * `pickupStatusCounts`/`financeStatusCounts` power this page's own
 * pickup/money charts — same per-status-count pattern
 * useAdminOverviewStats uses for its charts, just against endpoints
 * that are already driver-scoped server-side (CollectionRequestViewSet
 * and FinanceRecordViewSet both filter to "mine" for a driver — see
 * their own get_queryset), so no new backend endpoint was needed here
 * either. */
const useDriverOverviewStats = () => {
  const available = usePickupRequests({ page: 1, status: 'pending' });
  const mine = usePickupRequests({ page: 1, status: 'scheduled' });

  const openRouteStops = mine.requests.filter(
    (r) => r.route?.status === 'open',
  ).length;

  const [pickupStatusCounts, setPickupStatusCounts] = useState<Record<
    PickupStatus,
    number
  > | null>(null);
  const [financeStatusCounts, setFinanceStatusCounts] = useState<Record<
    FinanceStatus,
    number
  > | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      PICKUP_STATUSES.map((status) =>
        listPickupRequests({ status }).then(
          (data) => [status, data.count] as const,
        ),
      ),
    )
      .then((pairs) => {
        if (!cancelled)
          setPickupStatusCounts(
            Object.fromEntries(pairs) as Record<PickupStatus, number>,
          );
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
        if (!cancelled)
          setFinanceStatusCounts(
            Object.fromEntries(pairs) as Record<FinanceStatus, number>,
          );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    availableCount: available.loading ? null : available.count,
    assignedCount: mine.loading ? null : mine.count,
    openRouteStops,
    routeLoading: mine.loading,
    assigned: mine.requests,
    assignedLoading: mine.loading,
    assignedError: mine.error,
    refetchAssigned: mine.refetch,
    pickupStatusCounts,
    financeStatusCounts,
  };
};

export { useDriverOverviewStats };
