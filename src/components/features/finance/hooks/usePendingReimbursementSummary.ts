import { useCallback, useEffect, useState } from 'react';

import { listFinanceRecords } from '../services/financeService';

type Summary = { count: number; total: number };

const INITIAL: Summary = { count: 0, total: 0 };

/** The driver's own pending-reimbursement count+total — powers the
 * "Claim Reimbursement" banner on the driver's pickups view. Capped at
 * 200 (DefaultPagination's max_page_size) — a driver realistically
 * never has more pending records than that at once. */
const usePendingReimbursementSummary = () => {
  const [summary, setSummary] = useState<Summary>(INITIAL);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const data = await listFinanceRecords({
        status: 'pending',
        pageSize: 200,
      });
      const total = data.results.reduce(
        (sum, r) => sum + Number(r.actual_amount ?? r.price),
        0,
      );
      setSummary({ count: data.count, total });
    } catch {
      setSummary(INITIAL);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...summary, loading, refetch };
};

export { usePendingReimbursementSummary };
