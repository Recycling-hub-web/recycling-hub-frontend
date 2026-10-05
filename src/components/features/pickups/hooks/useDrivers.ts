import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listDrivers } from '../services/driverService';
import type { Driver } from '../types';

/** For the assign-driver modal's driver picker — fetched once when the
 * modal opens, same pattern as useCollectors. */
const useDrivers = (enabled: boolean) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setDrivers(await listDrivers());
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load drivers.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) refetch();
  }, [enabled, refetch]);

  return { drivers, loading, error, refetch };
};

export { useDrivers };
