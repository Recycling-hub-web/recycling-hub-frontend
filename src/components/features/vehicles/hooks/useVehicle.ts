import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getVehicle } from '../services/vehiclesService';
import type { Vehicle } from '../types';

/** Fetches a single vehicle's full detail — mirrors useCategory's shape. */
const useVehicle = (id: string) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getVehicle(id);
      setVehicle(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this vehicle.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { vehicle, loading, error, refetch };
};

export { useVehicle };
