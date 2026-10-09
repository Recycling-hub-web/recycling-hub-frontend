import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listCollectionPoints } from '../services/collectionPointService';
import type { CollectionPoint } from '../types';

type UseCollectionPointsParams = {
  page: number;
  search?: string;
};

/** Fetches one page of collection points — mirrors useClassifications'
 * shape. */
const useCollectionPoints = ({ page, search }: UseCollectionPointsParams) => {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>(
    [],
  );
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listCollectionPoints({ page, search });
      setCollectionPoints(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load collection points.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { collectionPoints, count, loading, error, refetch };
};

export { useCollectionPoints };
