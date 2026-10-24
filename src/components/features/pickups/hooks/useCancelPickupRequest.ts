import { useState } from 'react';

import type { CancelPickupRequestPayload } from '../services/pickupService';
import { cancelPickupRequest } from '../services/pickupService';

/** Cancels the PickupRequest AND force-cancels every non-terminal Order
 * under it, in one action — distinct from useCancelOrder, which
 * cancels just one Order. */
const useCancelPickupRequest = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: CancelPickupRequestPayload) => {
    setLoading(true);
    try {
      return await cancelPickupRequest(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useCancelPickupRequest };
