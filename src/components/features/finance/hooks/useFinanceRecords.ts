import { useCallback, useEffect, useState } from 'react';

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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listFinanceRecords({
        page,
        status: status || undefined,
      });
      setRecords(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load finance records.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { records, count, loading, error, refetch };
};

export { useFinanceRecords };
