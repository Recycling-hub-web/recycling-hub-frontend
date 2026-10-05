import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreatePickupRequestPayload } from '../services/pickupService';
import { convertQuickPickupRequest } from '../services/pickupService';

const useConvertQuickPickupRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (id: string, payload: CreatePickupRequestPayload) => {
    setLoading(true);
    setError('');
    try {
      return await convertQuickPickupRequest(id, payload);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not complete this request.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useConvertQuickPickupRequest };
