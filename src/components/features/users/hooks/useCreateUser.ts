import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreateUserPayload } from '../services/userService';
import { createUser } from '../services/userService';

const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreateUserPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createUser(payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create the user.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateUser };
