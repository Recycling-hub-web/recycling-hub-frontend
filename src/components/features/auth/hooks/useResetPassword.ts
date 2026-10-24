import { useState } from 'react';

import { resetPassword } from '../services/authService';

/** `execute` matches PasswordSetupForm's `onSubmit: (token, password) =>
 * Promise<unknown>` prop exactly — pass it straight through, no wrapper
 * needed at the call site. */
const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (token: string, password: string) => {
    setLoading(true);
    try {
      return await resetPassword(token, password);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useResetPassword };
