import { useState } from 'react';

import type { UpdateOrderPayload } from '../services/pickupService';
import { updateOrder } from '../services/pickupService';

/** Renamed from useUpdatePickupRequest — this updates an Order (date/
 * note/items), not the new PickupRequest-level edit (see
 * useUpdatePickupRequest.ts for that). */
const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: UpdateOrderPayload) => {
    setLoading(true);
    try {
      return await updateOrder(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateOrder };
