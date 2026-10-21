import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listClaims } from '../services/claimsService';
import type { ClaimCategory, ClaimListItem, ClaimStatus } from '../types';

type UseClaimsParams = {
  page: number;
  status?: ClaimStatus | '';
  category?: ClaimCategory | '';
};

const useClaims = ({ page, status, category }: UseClaimsParams) => {
  const [claims, setClaims] = useState<ClaimListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listClaims({
        page,
        status: status || undefined,
        category: category || undefined,
      });
      setClaims(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load claims.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, status, category]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { claims, count, loading, error, refetch };
};

export { useClaims };
