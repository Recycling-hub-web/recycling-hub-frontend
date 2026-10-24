import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreateCategoryPayload } from '../services/categoryService';
import { createCategory } from '../services/categoryService';

const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreateCategoryPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createCategory(payload);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not create the category.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateCategory };
