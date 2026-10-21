import { useCallback, useEffect, useState } from 'react';

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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listPickupRequests({
        page,
        status,
        search,
        requestType,
      });
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
  }, [page, status, search, requestType]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { requests, count, loading, error, refetch };
};

export { usePickupRequests };
