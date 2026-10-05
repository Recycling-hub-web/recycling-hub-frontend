import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreateQuickPickupRequestPayload } from '../services/pickupService';
import { createQuickPickupRequest } from '../services/pickupService';

const useCreateQuickPickupRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreateQuickPickupRequestPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createQuickPickupRequest(payload);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not submit your request.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateQuickPickupRequest };
