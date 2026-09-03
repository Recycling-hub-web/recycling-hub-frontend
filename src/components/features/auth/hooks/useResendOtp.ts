import { useState } from 'react';

import { resendLoginOtp } from '../services/authService';

const useResendOtp = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (email: string) => {
    setLoading(true);
    try {
      return await resendLoginOtp(email);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useResendOtp };
