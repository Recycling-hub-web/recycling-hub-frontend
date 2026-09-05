import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listClassifications } from '../services/classificationService';
import type { ClassificationListItem } from '../types';

type UseClassificationsParams = {
  page: number;
  search?: string;
};

/** Fetches one page of classifications — mirrors useCategories' shape. */
const useClassifications = ({ page, search }: UseClassificationsParams) => {
  const [classifications, setClassifications] = useState<
    ClassificationListItem[]
  >([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listClassifications({ page, search });
      setClassifications(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load classifications.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { classifications, count, loading, error, refetch };
};

export { useClassifications };
