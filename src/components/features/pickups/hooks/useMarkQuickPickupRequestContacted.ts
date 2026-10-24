import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { markQuickPickupRequestContacted } from '../services/pickupService';

const useMarkQuickPickupRequestContacted = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      return await markQuickPickupRequestContacted(id);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not update this lead.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useMarkQuickPickupRequestContacted };
