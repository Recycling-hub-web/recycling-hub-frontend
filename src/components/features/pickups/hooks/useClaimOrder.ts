import { useState } from 'react';

import { claimOrder } from '../services/pickupService';

/** A driver self-assigning to an Order (renamed from
 * useClaimPickupRequest). */
const useClaimOrder = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      return await claimOrder(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useClaimOrder };
