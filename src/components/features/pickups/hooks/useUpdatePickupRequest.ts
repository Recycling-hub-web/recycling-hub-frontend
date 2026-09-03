import { useState } from 'react';

import type { UpdatePickupRequestPayload } from '../services/pickupService';
import { updatePickupRequest } from '../services/pickupService';

const useUpdatePickupRequest = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: UpdatePickupRequestPayload) => {
    setLoading(true);
    try {
      return await updatePickupRequest(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdatePickupRequest };
