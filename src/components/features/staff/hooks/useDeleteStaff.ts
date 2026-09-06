import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { deleteStaff } from '../services/staffService';

const useDeleteStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      return await deleteStaff(id);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not delete this staff profile.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useDeleteStaff };
