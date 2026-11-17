import { useCallback, useEffect, useRef, useState } from 'react';

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

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    setLoading(true);
    setError('');
    try {
      const data = await listClaims({
        page,
        status: status || undefined,
        category: category || undefined,
      });
      if (generation !== requestGeneration.current) return;
      setClaims(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError ? err.message : 'Could not load claims.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, status, category]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { claims, count, loading, error, refetch };
};

export { useClaims };
