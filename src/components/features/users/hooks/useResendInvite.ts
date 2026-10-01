import { useState } from 'react';

import { resendInvite } from '../services/userService';

const useResendInvite = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      return await resendInvite(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useResendInvite };
