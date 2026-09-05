import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listCategories } from '../services/categoryService';
import type { CategoryListItem } from '../types';

type UseCategoriesParams = {
  page: number;
  isActive?: 'true' | 'false';
  search?: string;
};

/** Fetches one page of material categories — mirrors useContactMessages'
 * shape exactly. */
const useCategories = ({ page, isActive, search }: UseCategoriesParams) => {
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listCategories({ page, isActive, search });
      setCategories(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load categories.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, isActive, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { categories, count, loading, error, refetch };
};

export { useCategories };
