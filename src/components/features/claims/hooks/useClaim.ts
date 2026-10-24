import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getClaim } from '../services/claimsService';
import type { ClaimListItem } from '../types';

const useClaim = (id: string) => {
  const [claim, setClaim] = useState<ClaimListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setClaim(await getClaim(id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this claim.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { claim, loading, error, refetch };
};

export { useClaim };
