import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listCollectionPoints } from '../services/collectionPointService';
import type { CollectionPointOption } from '../types';

/** For the Optimize Route modal's collection-point picker — fetched
 * once when the modal opens, same pattern as useDrivers/useCollectors. */
const useCollectionPoints = (enabled: boolean) => {
  const [collectionPoints, setCollectionPoints] = useState<
    CollectionPointOption[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCollectionPoints(await listCollectionPoints());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load collection points.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) refetch();
  }, [enabled, refetch]);

  return { collectionPoints, loading, error, refetch };
};

export { useCollectionPoints };
