import { useState } from 'react';

import { changePassword } from '../services/authService';

/** Wraps POST /auth/password-change/ — a real, working backend endpoint
 * with no frontend screen calling it yet. Ready for whenever a
 * "change password" UI gets built (e.g. a settings page). */
const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      return await changePassword(oldPassword, newPassword);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useChangePassword };
