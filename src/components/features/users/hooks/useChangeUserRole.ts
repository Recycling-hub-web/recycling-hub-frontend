import { useState } from 'react';

import type { UserRole } from '../../../../types/auth';
import { changeUserRole } from '../services/userService';

const useChangeUserRole = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, role: UserRole) => {
    setLoading(true);
    try {
      return await changeUserRole(id, role);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useChangeUserRole };
