import { useState } from 'react';

import type { UserDetail } from '../../../../types/auth';
import { updateUser } from '../services/userService';

const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (
    id: string,
    payload: Partial<
      Pick<
        UserDetail,
        'full_name' | 'phone_number' | 'is_active' | 'is_2fa_enabled'
      >
    >,
  ) => {
    setLoading(true);
    try {
      return await updateUser(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateUser };
