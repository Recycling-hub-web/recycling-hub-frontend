import { useEffect, useState } from 'react';

import { useOrders } from '../../pickups/hooks';
import { getReceivingOverviewStats } from '../services/overviewService';

/** Deliveries awaiting close + the preview table both still come from
 * the same `status: 'delivered'` query ReceivingDeliveriesView's own
 * default filter already uses (see its own docstring: the receiving
 * officer's queryset is server-scoped to only `delivered`/`closed` —
 * see CollectionRequestViewSet.get_queryset) — same data, no second
 * fetch. `closedThisMonth`/the status breakdown are real aggregates
 * (ReceivingOverviewStatsView) this role didn't have before. The trend
 * chart itself is a separate, selectable-range endpoint — see
 * useReceivingVolume/PickupVolumeChart. */
const useReceivingOverviewStats = () => {
  const { requests, count, loading, error, refetch } = useOrders({
    page: 1,
    status: 'delivered',
  });

  const [closedThisMonth, setClosedThisMonth] = useState<number | null>(null);
  const [pickupStatusCounts, setPickupStatusCounts] = useState<Record<
    'delivered' | 'closed',
    number
  > | null>(null);

  useEffect(() => {
    let cancelled = false;

    getReceivingOverviewStats()
      .then((data) => {
        if (cancelled) return;
        setClosedThisMonth(data.closed_this_month);
        setPickupStatusCounts(data.pickup_status_counts);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    awaitingCloseCount: loading ? null : count,
    closedThisMonth,
    pickupStatusCounts,
    deliveries: requests,
    loading,
    error,
    refetch,
  };
};

export { useReceivingOverviewStats };
