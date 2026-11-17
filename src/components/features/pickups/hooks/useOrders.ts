import { useCallback, useEffect, useRef, useState } from 'react';

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
  pageSize?: number;
  status?: PickupStatus | PickupStatus[];
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
  pageSize,
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

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    setLoading(true);
    setError('');
    try {
      const data = await listOrders({
        page,
        pageSize,
        status,
        search,
        requestType,
        evaluationStatus,
        dropOffPoint,
      });
      if (generation !== requestGeneration.current) return;
      setRequests(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError ? err.message : 'Could not load pickup orders.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [
    page,
    pageSize,
    status,
    search,
    requestType,
    evaluationStatus,
    dropOffPoint,
  ]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { requests, count, loading, error, refetch };
};

export { useOrders };
