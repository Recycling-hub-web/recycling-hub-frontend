import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { createStaff } from '../services/staffService';
import type { CreateStaffPayload } from '../types';

const useCreateStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreateStaffPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createStaff(payload);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not create the staff member.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateStaff };
