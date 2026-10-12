import { useCallback, useEffect, useState } from 'react';

import type { FinanceStatus } from '../../finance/types';
import { getAccountingOverviewStats } from '../services/overviewService';

type Stats = {
  count: number;
  amountPending: number;
  amountReimbursedThisMonth: number;
  financeStatusCounts: Record<FinanceStatus, number> | null;
};

const INITIAL: Stats = {
  count: 0,
  amountPending: 0,
  amountReimbursedThisMonth: 0,
  financeStatusCounts: null,
};

/** Unverified (`claimed` — a driver has submitted it, accounting hasn't
 * verified/reimbursed it yet) finance records + their total amount, now
 * a real server-side Sum (AccountingOverviewStatsView) rather than a
 * client-side sum capped at 200 fetched rows. */
const useAccountingOverviewStats = () => {
  const [stats, setStats] = useState<Stats>(INITIAL);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAccountingOverviewStats();
      setStats({
        count: data.unverified_records,
        amountPending: Number(data.amount_pending),
        amountReimbursedThisMonth: Number(data.amount_reimbursed_this_month),
        financeStatusCounts: data.finance_status_counts,
      });
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
