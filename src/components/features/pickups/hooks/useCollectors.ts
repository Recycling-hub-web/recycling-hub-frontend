import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listCollectors } from '../services/collectorService';
import type { Collector } from '../types';

/** For the schedule modal's collector picker — fetched once when the
 * modal opens (see ScheduleModal), not on every render. */
const useCollectors = (enabled: boolean) => {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCollectors(await listCollectors());
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load collectors.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) refetch();
  }, [enabled, refetch]);

  return { collectors, loading, error, refetch };
};

export { useCollectors };
