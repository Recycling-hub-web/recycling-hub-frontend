import { useState } from 'react';

import { logout } from '../services/authService';

/** AuthContext keeps its own direct `logout` (it also has to clear `user`
 * state, which this hook has no reason to know about) — this exists for
 * any other call site that just needs to hit the endpoint. */
const useLogout = () => {
  const [loading, setLoading] = useState(false);

  const execute = async () => {
    setLoading(true);
    try {
      return await logout();
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useLogout };
