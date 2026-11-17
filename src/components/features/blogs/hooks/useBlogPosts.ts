import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listBlogPosts } from '../services/blogService';
import type { BlogPost, BlogStatus } from '../types';

type UseBlogPostsParams = {
  page: number;
  status?: BlogStatus;
  search?: string;
};

/** Fetches one page of blog posts — mirrors useCategories' shape. */
const useBlogPosts = ({ page, status, search }: UseBlogPostsParams) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
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
      const data = await listBlogPosts({ page, status, search });
      if (generation !== requestGeneration.current) return;
      setPosts(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError ? err.message : 'Could not load blog posts.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { posts, count, loading, error, refetch };
};

export { useBlogPosts };
