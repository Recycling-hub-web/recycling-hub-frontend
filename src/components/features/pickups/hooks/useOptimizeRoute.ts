import { useState } from 'react';

import type { OptimizeRoutePayload } from '../services/pickupService';
import { optimizeRoute } from '../services/pickupService';

const useOptimizeRoute = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (payload: OptimizeRoutePayload) => {
    setLoading(true);
    try {
      return await optimizeRoute(payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useOptimizeRoute };
