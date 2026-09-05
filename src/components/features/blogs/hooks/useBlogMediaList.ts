import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listBlogMedia } from '../services/blogService';
import type { BlogMedia } from '../types';

const useBlogMediaList = (blogId: string | null) => {
  const [media, setMedia] = useState<BlogMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!blogId) {
      setMedia([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await listBlogMedia(blogId);
      setMedia(data.results);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load media.');
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { media, loading, error, refetch };
};

export { useBlogMediaList };
