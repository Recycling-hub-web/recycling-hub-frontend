import { useState } from 'react';

import { setPassword } from '../services/authService';

/** Same backend endpoint as useResetPassword — kept as a separate hook so
 * the set-password vs reset-password call sites read clearly, mirroring
 * `setPassword`/`resetPassword` being two named exports over one endpoint
 * in the service itself. */
const useSetPassword = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (token: string, password: string) => {
    setLoading(true);
    try {
      return await setPassword(token, password);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useSetPassword };
