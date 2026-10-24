import { useState } from 'react';

import { forgotPassword } from '../services/authService';

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (email: string) => {
    setLoading(true);
    try {
      return await forgotPassword(email);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useForgotPassword };
