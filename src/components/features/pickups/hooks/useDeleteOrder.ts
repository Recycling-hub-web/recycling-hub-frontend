import { useState } from 'react';

import { deleteOrder } from '../services/pickupService';

const useDeleteOrder = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteOrder(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteOrder };
