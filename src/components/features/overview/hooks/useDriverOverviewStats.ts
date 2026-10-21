import { useEffect, useState } from 'react';

import type { FinanceStatus } from '../../finance/types';
import { useOrders } from '../../pickups/hooks';
import type { PickupStatus } from '../../pickups/types';
import { getDriverOverviewStats } from '../services/overviewService';

/** Driver's own "today" picture — the available/assigned counts and the
 * assigned-pickups preview table still come straight from the same two
 * scoped queries DriverPickupsView itself already runs (both already
 * server-scoped to this driver, see CollectionRequestViewSet
 * .get_queryset's driver branch) — no reason to re-fetch rows the UI
 * already has just to read a count off them. "Open route" is likewise
 * derived from those same rows (how many of the driver's `scheduled`
 * requests sit on a route still `status: 'open'`), not a second fetch.
 *
 * `pickupStatusCounts`/`financeStatusCounts` power this page's own
 * pickup/money charts — these DO need a real request
 * (DriverOverviewStatsView), since they cover statuses the two queries
 * above don't (e.g. `collected`/`delivered`/`closed`). */
const useDriverOverviewStats = () => {
  const available = useOrders({ page: 1, status: 'pending' });
  const mine = useOrders({ page: 1, status: 'scheduled' });

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

    getDriverOverviewStats()
      .then((data) => {
        if (cancelled) return;
        setPickupStatusCounts(data.pickup_status_counts);
        setFinanceStatusCounts(data.finance_status_counts);
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
