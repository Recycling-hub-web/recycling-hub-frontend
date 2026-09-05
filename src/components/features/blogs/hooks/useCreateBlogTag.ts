import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { createBlogTag } from '../services/blogService';

const useCreateBlogTag = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (name: string) => {
    setLoading(true);
    setError('');
    try {
      return await createBlogTag(name);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create the tag.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateBlogTag };
