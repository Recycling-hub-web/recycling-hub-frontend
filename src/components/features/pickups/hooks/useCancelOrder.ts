import { useState } from 'react';

import type { CancelOrderPayload } from '../services/pickupService';
import { cancelOrder } from '../services/pickupService';

/** Cancels one Order (renamed from useCancelPickup) — distinct from
 * useCancelPickupRequest, which cancels the parent PickupRequest and
 * cascades to every Order under it. */
const useCancelOrder = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: CancelOrderPayload) => {
    setLoading(true);
    try {
      return await cancelOrder(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useCancelOrder };
