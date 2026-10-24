import { useState } from 'react';

import { login } from '../services/authService';

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (email: string, password: string) => {
    setLoading(true);
    try {
      return await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useLogin };
