import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listFinanceRecords } from '../services/financeService';
import type { FinanceRecordListItem, FinanceStatus } from '../types';

type UseFinanceRecordsParams = {
  page: number;
  status?: FinanceStatus | '';
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  ordering?: string;
  enabled?: boolean;
};

const useFinanceRecords = ({
  page,
  status,
  search,
  createdFrom,
  createdTo,
  ordering,
  enabled = true,
}: UseFinanceRecordsParams) => {
  const [records, setRecords] = useState<FinanceRecordListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [outOfRange, setOutOfRange] = useState(false);

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    setOutOfRange(false);
    if (!enabled) {
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await listFinanceRecords({
        page,
        status: status || undefined,
        search,
        createdFrom,
        createdTo,
        ordering,
      });
      if (generation !== requestGeneration.current) return;
      setRecords(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      if (err instanceof ApiError && err.status === 404 && page > 1) {
        setOutOfRange(true);
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load finance records.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, status, search, createdFrom, createdTo, ordering, enabled]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { records, count, loading, error, refetch, outOfRange };
};

export { useFinanceRecords };
