import { useCallback, useEffect, useState } from 'react';

import { listFinanceRecords } from '../../finance/services/financeService';

type Stats = {
  count: number;
  amountPending: number;
};

const INITIAL: Stats = { count: 0, amountPending: 0 };

/** Unverified (`claimed` — a driver has submitted it, accounting hasn't
 * verified/reimbursed it yet) finance records + their total amount.
 * Same bounded-sum pattern finance/hooks/usePendingReimbursementSummary
 * already uses for the driver's own banner: capped at 200
 * (DefaultPagination's max_page_size) since there's no real
 * server-side sum endpoint, just a per-record amount field — see that
 * hook's own docstring and financeService.listFinanceRecords. */
const useAccountingOverviewStats = () => {
  const [stats, setStats] = useState<Stats>(INITIAL);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listFinanceRecords({
        status: 'claimed',
        pageSize: 200,
      });
      const amountPending = data.results.reduce(
        (sum, r) => sum + Number(r.actual_amount ?? r.price),
        0,
      );
      setStats({ count: data.count, amountPending });
    } catch {
      setStats(INITIAL);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...stats, loading, refetch };
};

export { useAccountingOverviewStats };
