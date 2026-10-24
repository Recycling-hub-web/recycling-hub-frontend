import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getBlogPost } from '../services/blogService';
import type { BlogPost } from '../types';

/** Fetches a single post's full detail — mirrors useCategory's shape. */
const useBlogPost = (id: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBlogPost(id);
      setPost(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this post.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { post, loading, error, refetch };
};

export { useBlogPost };
