import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { updateBlogTag } from '../services/blogService';

const useUpdateBlogTag = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (id: string, name: string) => {
    setLoading(true);
    setError('');
    try {
      return await updateBlogTag(id, name);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not update the tag.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useUpdateBlogTag };
