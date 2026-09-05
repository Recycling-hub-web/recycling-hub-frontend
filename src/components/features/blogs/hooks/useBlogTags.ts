import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listBlogTags } from '../services/blogService';
import type { BlogTag } from '../types';

const useBlogTags = (search?: string) => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listBlogTags({ search });
      setTags(data.results);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load tags.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { tags, count, loading, error, refetch };
};

export { useBlogTags };
