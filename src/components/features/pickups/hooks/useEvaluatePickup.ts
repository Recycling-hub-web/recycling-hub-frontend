import { useState } from 'react';

import type { EvaluatePickupPayload } from '../services/pickupService';
import { evaluatePickupRequest } from '../services/pickupService';

const useEvaluatePickup = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: EvaluatePickupPayload) => {
    setLoading(true);
    try {
      return await evaluatePickupRequest(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useEvaluatePickup };
