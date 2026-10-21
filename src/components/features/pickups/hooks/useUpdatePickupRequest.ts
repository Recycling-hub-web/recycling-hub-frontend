import { useState } from 'react';

import type { PickupRequestUpdatePayload } from '../services/pickupService';
import { updatePickupRequest } from '../services/pickupService';

/** Admin/staff correcting the requester's own contact/address/date —
 * distinct from useUpdateOrder, which edits an Order's date/note/
 * items. */
const useUpdatePickupRequest = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: PickupRequestUpdatePayload) => {
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
