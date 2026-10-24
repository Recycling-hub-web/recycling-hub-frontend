import { useState } from 'react';

import type { CollectionPointPayload } from '../services/collectionPointService';
import { updateCollectionPoint } from '../services/collectionPointService';

const useUpdateCollectionPoint = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: CollectionPointPayload) => {
    setLoading(true);
    try {
      return await updateCollectionPoint(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateCollectionPoint };
