import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CollectionPointPayload } from '../services/collectionPointService';
import { createCollectionPoint } from '../services/collectionPointService';

const useCreateCollectionPoint = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CollectionPointPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createCollectionPoint(payload);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not create the collection point.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateCollectionPoint };
