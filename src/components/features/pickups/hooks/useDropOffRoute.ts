import { useState } from 'react';

import type { DropOffPayload } from '../services/pickupService';
import { dropOffRoute } from '../services/pickupService';

/** The driver's batch store drop-off — see pickupService.dropOffRoute. */
const useDropOffRoute = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (payload: DropOffPayload) => {
    setLoading(true);
    try {
      return await dropOffRoute(payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDropOffRoute };
