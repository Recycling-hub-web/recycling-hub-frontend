import { useState } from 'react';

import { deleteCollectionPoint } from '../services/collectionPointService';

const useDeleteCollectionPoint = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteCollectionPoint(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteCollectionPoint };
