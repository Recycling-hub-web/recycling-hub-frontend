import { useState } from 'react';

import { deletePickupRequest } from '../services/pickupService';

const useDeletePickupRequest = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deletePickupRequest(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeletePickupRequest };
