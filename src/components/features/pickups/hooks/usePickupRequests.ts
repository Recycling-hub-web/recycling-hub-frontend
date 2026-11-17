import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listPickupRequests } from '../services/pickupService';
import type {
  PickupRequestListItem,
  PickupRequestStatus,
  PickupRequestType,
} from '../types';

type UsePickupRequestsParams = {
  page: number;
  status?: PickupRequestStatus;
  search?: string;
  requestType?: PickupRequestType;
};

/** The new, higher-level PickupRequest list — the customer's ask, each
 * with its own Orders nested. Admin/staff only. */
const usePickupRequests = ({
  page,
  status,
  search,
  requestType,
}: UsePickupRequestsParams) => {
  const [requests, setRequests] = useState<PickupRequestListItem[]>([]);
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
      const data = await listPickupRequests({
        page,
        status,
        search,
        requestType,
      });
      if (generation !== requestGeneration.current) return;
      setRequests(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load pickup requests.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, status, search, requestType]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { requests, count, loading, error, refetch };
};

export { usePickupRequests };
