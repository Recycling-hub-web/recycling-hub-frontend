import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listQuickPickupRequests } from '../services/pickupService';
import type {
  PickupQuickRequestListItem,
  PickupQuickRequestStatus,
} from '../types';

type UseQuickPickupRequestsParams = {
  /** No default filter — "not yet converted" means *either* 'new' or
   * 'contacted', and the backend's `?status=` only does an exact match,
   * so excluding 'converted' happens on the caller's side (see
   * PickupRequestsView, which filters the Quick Leads tab's rows
   * instead of asking for one exact status here). Pass a single status
   * if you genuinely want just one. */
  status?: PickupQuickRequestStatus;
};

// No pagination controls yet — this queue is small-volume to start (see
// the quick-pickup-requests plan); add paging here the same way
// usePickupRequests does if/when it's ever needed.
const useQuickPickupRequests = ({
  status,
}: UseQuickPickupRequestsParams = {}) => {
  const [requests, setRequests] = useState<PickupQuickRequestListItem[]>([]);
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
      const data = await listQuickPickupRequests({ status });
      if (generation !== requestGeneration.current) return;
      setRequests(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError ? err.message : 'Could not load quick leads.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { requests, count, loading, error, refetch };
};

export { useQuickPickupRequests };
