import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listCollectionPoints } from '../services/collectionPointService';
import type { CollectionPoint } from '../types';

type UseCollectionPointsParams = {
  page: number;
  search?: string;
};

/** Fetches one page of collection points. */
const useCollectionPoints = ({ page, search }: UseCollectionPointsParams) => {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>(
    [],
  );
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
      const data = await listCollectionPoints({ page, search });
      if (generation !== requestGeneration.current) return;
      setCollectionPoints(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load collection points.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { collectionPoints, count, loading, error, refetch };
};

export { useCollectionPoints };
