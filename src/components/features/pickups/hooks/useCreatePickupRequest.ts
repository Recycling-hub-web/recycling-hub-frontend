import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreatePickupRequestPayload } from '../services/pickupService';
import { createPickupRequest } from '../services/pickupService';

const useCreatePickupRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreatePickupRequestPayload) => {
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
