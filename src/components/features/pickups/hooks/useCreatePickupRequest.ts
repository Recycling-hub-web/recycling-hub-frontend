import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { PickupRequestCreatePayload } from '../services/pickupService';
import { createPickupRequest } from '../services/pickupService';

/** Submits the customer's ask — public, no auth. Repurposed (same name,
 * new meaning) now that the old flat create is gone; see the module
 * docstring in pickupService.ts. */
const useCreatePickupRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: PickupRequestCreatePayload) => {
    setLoading(true);
    setError('');
    try {
      return await createPickupRequest(payload);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not submit the pickup request.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreatePickupRequest };
