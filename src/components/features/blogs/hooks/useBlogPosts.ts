import { useCallback, useEffect, useState } from 'react';

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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listBlogPosts({ page, status, search });
      setPosts(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load blog posts.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { posts, count, loading, error, refetch };
};

export { useBlogPosts };
