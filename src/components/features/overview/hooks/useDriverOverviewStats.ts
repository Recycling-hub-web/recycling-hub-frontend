import { useCallback, useEffect, useRef, useState } from 'react';

import type { FinanceStatus } from '../../finance/types';
import { useOrders } from '../../pickups/hooks';
import type { PickupStatus } from '../../pickups/types';
import { getDriverOverviewStats } from '../services/overviewService';

/** Driver's own "today" picture — the available/assigned counts and the
 * assigned-pickups preview table still come straight from the same two
 * scoped queries DriverPickupsView itself already runs (both already
 * server-scoped to this driver, see CollectionRequestViewSet
 * .get_queryset's driver branch) — no reason to re-fetch rows the UI
 * already has just to read a count off them. The open-route stop count
 * comes from the aggregate endpoint, independently of the preview page.
 *
 * `pickupStatusCounts`/`financeStatusCounts` power this page's own
 * pickup/money charts — these DO need a real request
 * (DriverOverviewStatsView), since they cover statuses the two queries
 * above don't (e.g. `collected`/`delivered`/`closed`). */
const useDriverOverviewStats = () => {
  const available = useOrders({ page: 1, status: 'pending' });
  const mine = useOrders({ page: 1, status: 'scheduled' });

  const [openRouteStops, setOpenRouteStops] = useState(0);

  const [pickupStatusCounts, setPickupStatusCounts] = useState<Record<
    PickupStatus,
    number
  > | null>(null);
  const [financeStatusCounts, setFinanceStatusCounts] = useState<Record<
    FinanceStatus,
    number
  > | null>(null);

  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState('');
  const generation = useRef(0);
  const refetchStatuses = useCallback(async () => {
    generation.current += 1;
    const request = generation.current;
    setStatusLoading(true);
    setStatusError('');
    try {
      const data = await getDriverOverviewStats();
      if (request !== generation.current) return;
      setOpenRouteStops(data.open_route_stops);
      setPickupStatusCounts(data.pickup_status_counts);
      setFinanceStatusCounts(data.finance_status_counts);
    } catch {
      if (request === generation.current)
        setStatusError('Could not load status totals.');
    } finally {
      if (request === generation.current) setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchStatuses();
    return () => {
      generation.current += 1;
    };
  }, [refetchStatuses]);

  return {
    availableCount:
      available.loading || available.error ? null : available.count,
    assignedCount: mine.loading || mine.error ? null : mine.count,
    openRouteStops,
    routeLoading: statusLoading,
    routeError: statusError,
    refetchRoute: refetchStatuses,
    assigned: mine.requests,
    assignedLoading: mine.loading,
    assignedError: mine.error,
    refetchAssigned: mine.refetch,
    availableError: available.error,
    refetchAvailable: available.refetch,
    statusLoading,
    statusError,
    refetchStatuses,
    pickupStatusCounts,
    financeStatusCounts,
  };
};

export { useDriverOverviewStats };
