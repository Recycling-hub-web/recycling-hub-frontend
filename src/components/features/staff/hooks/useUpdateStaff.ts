import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { updateStaff } from '../services/staffService';
import type { UpdateStaffPayload } from '../types';

const useUpdateStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (id: string, payload: UpdateStaffPayload) => {
    setLoading(true);
    setError('');
    try {
      return await updateStaff(id, payload);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not update this staff profile.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useUpdateStaff };
