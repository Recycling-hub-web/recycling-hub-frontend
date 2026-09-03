import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getPickupRequest } from '../services/pickupService';
import type { PickupRequestDetails } from '../types';

const usePickupRequest = (id: string) => {
  const [request, setRequest] = useState<PickupRequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRequest(await getPickupRequest(id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load this pickup request.',
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

export { usePickupRequest };
