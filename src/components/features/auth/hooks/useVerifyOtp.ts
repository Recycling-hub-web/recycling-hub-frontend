import { useState } from 'react';

import { verifyLoginOtp } from '../services/authService';

const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (email: string, code: string) => {
    setLoading(true);
    try {
      return await verifyLoginOtp(email, code);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useVerifyOtp };
