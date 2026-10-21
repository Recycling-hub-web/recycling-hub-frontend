import { useCallback, useEffect, useState } from 'react';

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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listVehicles({ page });
      setVehicles(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load vehicles.',
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { vehicles, count, loading, error, refetch };
};

export { useVehicles };
