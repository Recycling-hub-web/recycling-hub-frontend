import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { BlogPostPayload } from '../services/blogService';
import { createBlogPost } from '../services/blogService';

const useCreateBlogPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: BlogPostPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createBlogPost(payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create the post.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateBlogPost };
