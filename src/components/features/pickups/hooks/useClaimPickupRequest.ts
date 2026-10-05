import { useState } from 'react';

import { claimPickupRequest } from '../services/pickupService';

const useClaimPickupRequest = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      return await claimPickupRequest(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useClaimPickupRequest };
