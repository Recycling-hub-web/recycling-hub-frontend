import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listOrders } from '../services/pickupService';
import type {
  CollectionRequestListItem,
  PickupEvaluationStatus,
  PickupRequestType,
  PickupStatus,
} from '../types';

type UseOrdersParams = {
  page: number;
  status?: PickupStatus;
  search?: string;
  requestType?: PickupRequestType;
  evaluationStatus?: PickupEvaluationStatus;
  dropOffPoint?: string;
};

/** Orders — CollectionRequest, still GET /pickups/ (renamed from
 * usePickupRequests now that that name means the new, higher-level
 * PickupRequest concept — see usePickupRequests.ts). */
const useOrders = ({
  page,
  status,
  search,
  requestType,
  evaluationStatus,
  dropOffPoint,
}: UseOrdersParams) => {
  const [requests, setRequests] = useState<CollectionRequestListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listOrders({
        page,
        status,
        search,
        requestType,
        evaluationStatus,
        dropOffPoint,
      });
      setRequests(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load pickup orders.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, status, search, requestType, evaluationStatus, dropOffPoint]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { requests, count, loading, error, refetch };
};

export { useOrders };
