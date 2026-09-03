import { useState } from 'react';

import type { CancelPickupPayload } from '../services/pickupService';
import { cancelPickupRequest } from '../services/pickupService';

const useCancelPickup = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: CancelPickupPayload) => {
    setLoading(true);
    try {
      return await cancelPickupRequest(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useCancelPickup };
