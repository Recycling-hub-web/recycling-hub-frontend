import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getCollectionPoint } from '../services/collectionPointService';
import type { CollectionPoint } from '../types';

/** Fetches a single collection point's full detail — mirrors
 * useClassification's shape. */
const useCollectionPoint = (id: string) => {
  const [collectionPoint, setCollectionPoint] =
    useState<CollectionPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCollectionPoint(id);
      setCollectionPoint(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load this collection point.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { collectionPoint, loading, error, refetch };
};

export { useCollectionPoint };
