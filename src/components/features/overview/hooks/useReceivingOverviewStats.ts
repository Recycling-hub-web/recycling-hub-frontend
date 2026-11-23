import { useCallback, useEffect, useRef, useState } from 'react';

import { useOrders } from '../../pickups/hooks';
import { getReceivingOverviewStats } from '../services/overviewService';

/** Queue and aggregate totals fail independently and expose their own recovery. */
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
  const [totalsLoading, setTotalsLoading] = useState(true);
  const [totalsError, setTotalsError] = useState('');
  const generation = useRef(0);
  const retryTotals = useCallback(async () => {
    generation.current += 1;
    const request = generation.current;
    setTotalsLoading(true);
    setTotalsError('');
    try {
      const data = await getReceivingOverviewStats();
      if (request !== generation.current) return;
      setClosedThisMonth(data.closed_this_month);
      setPickupStatusCounts(data.pickup_status_counts);
    } catch {
      if (request === generation.current)
        setTotalsError('Could not load delivery totals.');
    } finally {
      if (request === generation.current) setTotalsLoading(false);
    }
  }, []);
  useEffect(() => {
    retryTotals();
    return () => {
      generation.current += 1;
    };
  }, [retryTotals]);
  return {
    awaitingCloseCount: loading || error ? null : count,
    closedThisMonth: totalsLoading || totalsError ? null : closedThisMonth,
    pickupStatusCounts,
    totalsLoading,
    totalsError,
    retryTotals,
    deliveries: requests,
    loading,
    error,
    refetch,
  };
};
export { useReceivingOverviewStats };
