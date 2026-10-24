import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { RoleLimitSettings } from '../services/userService';
import { updateRoleLimits } from '../services/userService';

const useUpdateRoleLimits = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (
    payload: Partial<
      Pick<RoleLimitSettings, 'admin_limit' | 'super_admin_limit'>
    >,
  ) => {
    setLoading(true);
    setError('');
    try {
      return await updateRoleLimits(payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not update role limits.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useUpdateRoleLimits };
