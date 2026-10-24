import { useState } from 'react';

import { closeDelivery } from '../services/pickupService';

/** Receiving Officer (or admin) verifying + closing a delivered
 * request — see pickupService.closeDelivery. */
const useCloseDelivery = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      return await closeDelivery(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useCloseDelivery };
