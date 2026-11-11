import { useState } from 'react';

import type { BulkAssignDriverPayload } from '../services/pickupService';
import { bulkAssignDriver } from '../services/pickupService';

const useBulkAssignDriver = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (payload: BulkAssignDriverPayload) => {
    setLoading(true);
    try {
      return await bulkAssignDriver(payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useBulkAssignDriver };
