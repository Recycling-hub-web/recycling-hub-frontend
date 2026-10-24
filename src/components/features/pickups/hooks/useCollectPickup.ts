import { useState } from 'react';

import type { CollectPickupPayload } from '../services/pickupService';
import { collectPickupRequest } from '../services/pickupService';

const useCollectPickup = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: CollectPickupPayload) => {
    setLoading(true);
    try {
      return await collectPickupRequest(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useCollectPickup };
