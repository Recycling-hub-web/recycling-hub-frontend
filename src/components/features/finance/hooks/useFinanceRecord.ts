import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getFinanceRecord } from '../services/financeService';
import type { FinanceRecordListItem } from '../types';

const useFinanceRecord = (id: string) => {
  const [record, setRecord] = useState<FinanceRecordListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRecord(await getFinanceRecord(id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load this finance record.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { record, loading, error, refetch };
};

export { useFinanceRecord };
