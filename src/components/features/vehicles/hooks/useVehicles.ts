import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listVehicles } from '../services/vehiclesService';
import type { Vehicle } from '../types';

type UseVehiclesParams = {
  page: number;
};

/** Fetches one page of fleet vehicles — mirrors useCategories' shape. */
const useVehicles = ({ page }: UseVehiclesParams) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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
      const data = await listVehicles({ page });
      if (generation !== requestGeneration.current) return;
      setVehicles(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError ? err.message : 'Could not load vehicles.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { vehicles, count, loading, error, refetch };
};

export { useVehicles };
