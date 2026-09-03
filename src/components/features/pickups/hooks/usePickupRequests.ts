import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listPickupRequests } from '../services/pickupService';
import type { PickupRequestListItem, PickupStatus } from '../types';

type UsePickupRequestsParams = {
  page: number;
  status?: PickupStatus;
};

const usePickupRequests = ({ page, status }: UsePickupRequestsParams) => {
  const [requests, setRequests] = useState<PickupRequestListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listPickupRequests({ page, status });
      setRequests(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load pickup requests.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { requests, count, loading, error, refetch };
};

export { usePickupRequests };
