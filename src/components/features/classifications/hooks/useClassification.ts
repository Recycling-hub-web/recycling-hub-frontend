import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getClassification } from '../services/classificationService';
import type { Classification } from '../types';

/** Fetches a single classification's full detail — mirrors
 * useCategory's shape. */
const useClassification = (id: string) => {
  const [classification, setClassification] = useState<Classification | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getClassification(id);
      setClassification(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load this classification.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { classification, loading, error, refetch };
};

export { useClassification };
