import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listFinanceRecords } from '../services/financeService';
import type { FinanceRecordListItem, FinanceStatus } from '../types';

type UseFinanceRecordsParams = {
  page: number;
  status?: FinanceStatus | '';
};

const useFinanceRecords = ({ page, status }: UseFinanceRecordsParams) => {
  const [records, setRecords] = useState<FinanceRecordListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    setLoading(true);
    setError('');
    try {
      const data = await listFinanceRecords({
        page,
        status: status || undefined,
      });
      if (generation !== requestGeneration.current) return;
      setRecords(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load finance records.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { records, count, loading, error, refetch };
};

export { useFinanceRecords };
