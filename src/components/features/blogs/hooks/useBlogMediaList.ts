import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listBlogMedia } from '../services/blogService';
import type { BlogMedia } from '../types';

const useBlogMediaList = (blogId: string | null) => {
  const [media, setMedia] = useState<BlogMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    if (!blogId) {
      setMedia([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await listBlogMedia(blogId);
      if (generation !== requestGeneration.current) return;
      setMedia(data.results);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(err instanceof ApiError ? err.message : 'Could not load media.');
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { media, loading, error, refetch };
};

export { useBlogMediaList };
