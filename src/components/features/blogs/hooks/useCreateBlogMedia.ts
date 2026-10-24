import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreateBlogMediaPayload } from '../services/blogService';
import { createBlogMedia } from '../services/blogService';

const useCreateBlogMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreateBlogMediaPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createBlogMedia(payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not attach the media.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateBlogMedia };
