import { useEffect, useState } from 'react';

import { usePickupRequests } from '../../pickups/hooks';
import type { DailyVolumePoint } from '../../pickups/services/pickupService';
import { getReceivingOverviewStats } from '../services/overviewService';

/** Deliveries awaiting close + the preview table both still come from
 * the same `status: 'delivered'` query ReceivingDeliveriesView's own
 * default filter already uses (see its own docstring: the receiving
 * officer's queryset is server-scoped to only `delivered`/`closed` —
 * see CollectionRequestViewSet.get_queryset) — same data, no second
 * fetch. `closedThisMonth`/the status breakdown/the trend chart are new
 * real aggregates (ReceivingOverviewStatsView) this role didn't have
 * before. */
const useReceivingOverviewStats = () => {
  const { requests, count, loading, error, refetch } = usePickupRequests({
    page: 1,
    status: 'delivered',
  });

  const [closedThisMonth, setClosedThisMonth] = useState<number | null>(null);
  const [pickupStatusCounts, setPickupStatusCounts] = useState<Record<
    'delivered' | 'closed',
    number
  > | null>(null);
  const [dailyClosedVolume, setDailyClosedVolume] = useState<
    DailyVolumePoint[] | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    getReceivingOverviewStats()
      .then((data) => {
        if (cancelled) return;
        setClosedThisMonth(data.closed_this_month);
        setPickupStatusCounts(data.pickup_status_counts);
        setDailyClosedVolume(data.daily_closed_volume);
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
    dailyClosedVolume,
    deliveries: requests,
    loading,
    error,
    refetch,
  };
};

export { useReceivingOverviewStats };
