import { useCallback, useEffect, useState } from 'react';

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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listQuickPickupRequests({ status });
      setRequests(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load quick leads.',
      );
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { requests, count, loading, error, refetch };
};

export { useQuickPickupRequests };
