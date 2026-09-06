import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listStaff } from '../services/staffService';
import type { StaffListItem } from '../types';

const useStaffList = (page: number) => {
  const [staff, setStaff] = useState<StaffListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listStaff(page);
      setStaff(data.results);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load staff.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { staff, count, loading, error, refetch };
};

export { useStaffList };
