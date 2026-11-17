import { useCallback, useEffect, useRef, useState } from 'react';

import { listFinanceRecords } from '../services/financeService';

type Summary = { count: number; total: number };

const INITIAL: Summary = { count: 0, total: 0 };

/** The driver's own pending-reimbursement count+total — powers the
 * automatic payment-review banner on the driver's pickups view. Capped at
 * 200 (DefaultPagination's max_page_size) — a driver realistically
 * never has more pending records than that at once. */
const usePendingReimbursementSummary = () => {
  const [summary, setSummary] = useState<Summary>(INITIAL);
  const [loading, setLoading] = useState(true);

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    try {
      const data = await listFinanceRecords({
        status: 'claimed',
        pageSize: 200,
      });
      const total = data.results.reduce(
        (sum, r) => sum + Number(r.actual_amount ?? r.price),
        0,
      );
      if (generation !== requestGeneration.current) return;
      setSummary({ count: data.count, total });
    } catch {
      if (generation !== requestGeneration.current) return;
      setSummary(INITIAL);
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { ...summary, loading, refetch };
};

export { usePendingReimbursementSummary };
