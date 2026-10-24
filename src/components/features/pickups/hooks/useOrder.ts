import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getOrder } from '../services/pickupService';
import type { CollectionRequestDetails } from '../types';

/** One Order — CollectionRequest, still GET /pickups/{id}/ (renamed
 * from usePickupRequest — see useOrders.ts for why). */
const useOrder = (id: string) => {
  const [request, setRequest] = useState<CollectionRequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRequest(await getOrder(id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load this pickup order.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { request, loading, error, refetch };
};

export { useOrder };
