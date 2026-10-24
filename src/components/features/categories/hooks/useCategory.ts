import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getCategory } from '../services/categoryService';
import type { Category } from '../types';

/** Fetches a single category's full detail (including children) — mirrors
 * useContactMessage's shape. */
const useCategory = (id: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCategory(id);
      setCategory(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this category.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { category, loading, error, refetch };
};

export { useCategory };
