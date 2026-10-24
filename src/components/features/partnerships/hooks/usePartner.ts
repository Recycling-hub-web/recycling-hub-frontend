import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getPartner } from '../services/partnershipService';
import type { Partner } from '../types';

const usePartner = (id: string) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPartner(await getPartner(id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this partner.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { partner, loading, error, refetch };
};

export { usePartner };
